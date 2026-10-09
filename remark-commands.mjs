// Remark plugin for the `##<name> … <name>##` commands (grammar: tag-syntax skill).
// Each command in COMMANDS becomes the `<name>` content component (app/components/content/),
// its flags, anywhere in the command, become props: `@handle…` → to, `#pri N` → pri, `!<when>` → when.
// Inside one paragraph/cell/line it wraps the inline nodes in between; opened in one
// paragraph and closed in a later one, it wraps those paragraphs as a block.
// Inline code is a separate node, so a `##todo` written as an example stays text.

// Allowlist: the command name becomes an HTML tag, so only names with a component pass
const COMMANDS = ['todo']
const OPEN = new RegExp(`(?<!#)##(${COMMANDS.join('|')})(?![\\w-])`)
// `!N` is the legacy priority; a date may carry a time and a zone (`:py`) or an offset (`-03`, `-03:00`)
const FLAG = /(?<=^|\s)(@[a-z][\w.-]*|#pri\s+\d+|!\d+(?![\d-])|!\d{4}-\d{2}-\d{2}(?:\s+\d{1,2}:\d{2}(?::[a-z]+|[+-]\d{2}(?::?\d{2})?)?)?|![a-z]+)(?=[\s,.;:)]|$)/gi
const closer = name => new RegExp(`(?<![\\w#])${name}##`)

// Pulls the flags out of the command's own text nodes; returns the props, strips the flags from the text
const readFlags = (nodes) => {
  const to = []
  let pri, when
  for (const node of nodes) {
    if (node.type !== 'text') continue
    node.value = node.value.replace(FLAG, (flag) => {
      if (flag.startsWith('@')) to.push(flag.slice(1))
      else if (flag.startsWith('#')) pri = flag.split(/\s+/)[1]
      else if (/^!\d+$/.test(flag)) pri = flag.slice(1)
      else when = flag.slice(1)
      return ''
    }).replace(/[ \t]{2,}/g, ' ').replace(/ +([,.;:])/g, '$1')
  }
  const first = nodes.find(n => n.type === 'text')
  if (first) first.value = first.value.replace(/^[\s,]+/, '')
  const props = {}
  if (to.length) props.to = to.join(' ')
  if (pri) props.pri = pri
  if (when) props.when = when
  return props
}

const command = (name, props, children, block) => ({
  type: block ? 'commandBlock' : 'command',
  data: { hName: name, hProperties: block ? { ...props, block: true } : props },
  children
})

const text = value => ({ type: 'text', value })

// Inline: opener and closer in direct text children of the same parent
const wrapInline = (children) => {
  for (let i = 0; i < children.length; i++) {
    const node = children[i]
    if (node.type !== 'text') continue
    const open = node.value.match(OPEN)
    if (!open) continue
    const name = open[1]
    const before = node.value.slice(0, open.index)
    const after = node.value.slice(open.index + open[0].length)
    // closer in the same text node, or in a later sibling text node
    let j = i
    let close = after.match(closer(name))
    while (!close && ++j < children.length) {
      if (children[j].type === 'text') close = children[j].value.match(closer(name))
    }
    if (!close) continue
    const closeText = j === i ? after : children[j].value
    const tail = closeText.slice(close.index + close[0].length)
    const inner = j === i
      ? [text(after.slice(0, close.index))]
      : [text(after), ...children.slice(i + 1, j), text(closeText.slice(0, close.index))]
    const props = readFlags(inner)
    const lastText = inner.at(-1)
    if (lastText.type === 'text') lastText.value = lastText.value.replace(/\s+$/, '')
    const body = inner.filter(n => n.type !== 'text' || n.value)
    children.splice(i, j - i + 1, ...[text(before), command(name, props, body), text(tail)].filter(n => n.type !== 'text' || n.value))
  }
}

// Block: opener at the start of a paragraph left unclosed, closer at the end of a later paragraph
const wrapBlock = (children) => {
  for (let i = 0; i < children.length; i++) {
    const first = children[i].type === 'paragraph' && children[i].children[0]
    const open = first?.type === 'text' && first.value.match(OPEN)
    if (!open || open.index !== 0) continue
    const name = open[1]
    // closed inside its own paragraph: an inline command, not a block
    if (children[i].children.some(n => n.type === 'text' && closer(name).test(n.value))) continue
    // the closing paragraph: any of its text children holds the closer
    const hasCloser = n => n.type === 'paragraph' && n.children.some(c => c.type === 'text' && closer(name).test(c.value))
    const j = children.findIndex((n, k) => k > i && hasCloser(n))
    if (j < 0) continue
    first.value = first.value.slice(open[0].length)
    // block flags come from the opening line only, an @mention further down stays text
    const [header, ...lines] = first.value.split('\n')
    const head = text(header)
    const props = readFlags([head])
    first.value = [head.value, ...lines].join('\n').replace(/^\s+/, '')
    // what follows the closer stays outside the command, as its own paragraph
    const last = children[j].children
    const at = last.findIndex(c => c.type === 'text' && closer(name).test(c.value))
    const [inside, ...after] = last[at].value.split(closer(name))
    const tail = [text(after.join('').replace(/^\s+/, '')), ...last.slice(at + 1)].filter(n => n.type !== 'text' || n.value)
    children[j] = { ...children[j], children: [...last.slice(0, at), text(inside.replace(/\s+$/, ''))].filter(n => n.type !== 'text' || n.value) }
    const body = children.slice(i, j + 1).filter(p => p.children.some(n => n.type !== 'text' || n.value.trim()))
    children.splice(i, j - i + 1, command(name, props, body, true), ...(tail.length ? [{ type: 'paragraph', children: tail }] : []))
  }
}

const walk = (node) => {
  if (!node.children) return
  wrapBlock(node.children)
  wrapInline(node.children)
  node.children.forEach(walk)
}

export default () => tree => walk(tree)
