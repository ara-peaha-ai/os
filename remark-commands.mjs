// Remark plugin for the `##<name> … <name>##` commands (grammar: tag-syntax skill).
// Each command becomes the `<name>` content component (app/components/content/),
// its leading flags become props: `@handle…` → to, `#pri N` → pri, `!<when>` → when.
// Inside one paragraph/cell/line it wraps the inline nodes in between; opened in one
// paragraph and closed in a later one, it wraps those paragraphs as a block.
// Inline code is a separate node, so a `##todo` written as an example stays text.

const OPEN = /(?<!#)##([a-z][\w-]*)/
const FLAG = /^\s*(@[\w.-]+|#pri\s+\d+|!\d{4}-\d{2}-\d{2}(?:\s+\d{1,2}:\d{2}(?::[a-z]+)?)?|![a-z]+)/i
const closer = name => new RegExp(`(?<![\\w#])${name}##`)

// Strips the leading flags off `text`, returns the props and what is left
const readFlags = (text) => {
  const to = []
  let pri, when, m
  while ((m = text.match(FLAG))) {
    const flag = m[1]
    if (flag.startsWith('@')) to.push(flag.slice(1))
    else if (flag.startsWith('#')) pri = flag.split(/\s+/)[1]
    else when = flag.slice(1)
    text = text.slice(m[0].length)
  }
  const props = {}
  if (to.length) props.to = to.join(' ')
  if (pri) props.pri = pri
  if (when) props.when = when
  return { props, rest: text.replace(/^\s+/, '') }
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
    const { props, rest } = readFlags(inner[0].value)
    inner[0] = text(rest)
    const body = inner.filter(n => n.type !== 'text' || n.value)
    if (body.length) {
      const last = body.at(-1)
      if (last.type === 'text') last.value = last.value.replace(/\s+$/, '')
    }
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
    const j = children.findIndex((n, k) => k > i && n.type === 'paragraph' && n.children.at(-1)?.type === 'text' && closer(name).test(n.children.at(-1).value))
    if (j < 0) continue
    const { props, rest } = readFlags(first.value.slice(open[0].length))
    first.value = rest
    const lastText = children[j].children.at(-1)
    lastText.value = lastText.value.replace(closer(name), '').replace(/\s+$/, '')
    const body = children.slice(i, j + 1).filter(p => p.children.some(n => n.type !== 'text' || n.value.trim()))
    children.splice(i, j - i + 1, command(name, props, body, true))
  }
}

const walk = (node) => {
  if (!node.children) return
  wrapBlock(node.children)
  wrapInline(node.children)
  node.children.forEach(walk)
}

export default () => tree => walk(tree)
