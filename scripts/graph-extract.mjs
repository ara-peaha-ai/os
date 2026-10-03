// Deterministic graph of a markdown tree, no LLM: folders, files, h2-h6 sections
// (h1 = frontmatter title), list items and frontmatter keys become nodes.
// Writes graphify's node-link graph.json, so `graphify cluster-only`, `query`,
// `path` and `explain` run on our structure instead of an LLM guess.
// Tree rules: sovereign content/original/doc/002.development/011.ai/claude.pri.md#content-tree
// Design: sovereign content/original/doc/002.development/011.ai/context-engine.pri.md
// usage: node scripts/graph-extract.mjs <content dir> [out graph.json] [--depth N]
//   --depth N: folders down to level N and headings down to hN (default 6); deeper content
//   folds into its level-N node, nothing is dropped
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, relative, dirname, resolve, basename } from 'node:path'
import yaml from 'js-yaml'

const args = process.argv.slice(2)
const depthAt = args.indexOf('--depth')
const DEPTH = depthAt >= 0 ? Number(args.splice(depthAt, 2)[1]) : 6
const [root, outPath = 'graphify-out/graph.json'] = args
if (!root || !(DEPTH >= 2 && DEPTH <= 6)) {
  console.error('usage: node scripts/graph-extract.mjs <content dir> [out graph.json] [--depth 2-6]')
  process.exit(1)
}

const nodes = new Map()
const links = []
const warnings = []

const toId = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const addNode = (id, attrs) => {
  if (!nodes.has(id)) nodes.set(id, { id, ...attrs })
  return id
}
const addLink = (source, target, relation, file, line) => links.push({
  source, target, relation, confidence: 'EXTRACTED', confidence_score: 1.0, weight: 1.0,
  source_file: file, source_location: line ? `L${line}` : null,
})

const FRONTMATTER_RE = /^---[ \t]*\r?\n([\s\S]*?)\n---[ \t]*(?:\r?\n|$)/
const HEADING_RE = /^(?:\d+\.\s+)?(#{1,6})\s+(.+?)\s*#*\s*$/ // `##todo` has no space: not a heading
const ITEM_RE = /^(\s*)(?:[-*+]|\d+\.)\s+(.+)$/
const LINK_RE = /\[[^\]]*\]\(([^)\s]+\.md)(?:#([^)\s]*))?\)/g
const TODO_RE = /#todo\b([^\n]*)/g

// public only with share AND public true; a missing flag follows the suffix (frontmatter skill)
const visibility = (file, fm) => {
  const pub = /\.pub\.[^.]+$/.test(file)
  const flag = (keys) => keys.map((k) => fm[k]).find((v) => v !== undefined)
  return (flag(['share', 'shared', 'publish']) ?? pub) && (flag(['public', 'published']) ?? pub) ? 'pub' : 'pri'
}

// `001.giovanni.pri.md` → order 1, base `giovanni`, suffix `pri`; letter prefixes (`00A.`) stay in the base
const NAME_RE = /^(?:(\d+)\.)?(.+?)(?:\.(pub|pri))?\.md$/
const LETTER_PREFIX_RE = /^\d+[a-z]\w*\./i
const parseName = (name) => {
  const [, order, base, suffix] = name.match(NAME_RE)
  return { order: order ? Number(order) : null, base, suffix: suffix ?? null }
}
const stripOrder = (dir) => dir.replace(/^\d+\./, '')

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.md') ? [join(dir, e.name)] : [])

// frontmatter value → nested field nodes; arrays of scalars stay one value (roles: [CMO, CFO])
const addFields = (parentId, parentLabel, value, ctx) => {
  for (const [key, v] of Object.entries(value)) {
    const id = addNode(`${parentId}__${toId(key)}`, {
      label: `${parentLabel} › ${key}`, file_type: 'concept', kind: 'field',
      source_file: ctx.file, source_location: 'L1', visibility: ctx.vis,
    })
    addLink(parentId, id, 'contains', ctx.file)
    const isScalarList = Array.isArray(v) && v.every((x) => x === null || typeof x !== 'object')
    if (v && typeof v === 'object' && !isScalarList) {
      // list of one-key maps (sizes: [{dress: M}, {shoes: 37}]) reads as one map
      const merged = Array.isArray(v) ? Object.assign({}, ...v.map((x) => (x && typeof x === 'object' ? x : {}))) : v
      addFields(id, `${parentLabel} › ${key}`, merged, ctx)
    } else {
      nodes.get(id).value = isScalarList ? v.join(', ') : String(v ?? '')
    }
  }
}

// link targets resolve after every file is parsed (see below)
const pendingRef = (source, target, file, line) => ({
  source, target, relation: 'references', confidence: 'EXTRACTED', confidence_score: 1.0, weight: 1.0,
  source_file: file, source_location: `L${line}`, pending: true,
})

const rootAbs = resolve(root)
const files = walk(rootAbs)
const idByPath = new Map() // absolute path → node id, for link resolution
const teamIdByHandle = new Map() // `@marta` → team/marta file (handles = team file names)
const HANDLE_ALIASES = { ai: 'claude' }
const entityKey = (file) => `${dirname(file)}/${parseName(basename(file)).base}`
const pairCount = files.reduce((acc, abs) => {
  const key = entityKey(relative(rootAbs, abs))
  return acc.set(key, (acc.get(key) ?? 0) + 1)
}, new Map())

for (const abs of files) {
  const file = relative(rootAbs, abs)
  const text = readFileSync(abs, 'utf8')
  const m = text.match(FRONTMATTER_RE)
  let fm = {}
  try { fm = (m && yaml.load(m[1])) || {} } catch (e) { warnings.push(`${file}: frontmatter not parsed (${e.reason ?? e.message})`) }
  const vis = visibility(file, fm)
  const { order, base, suffix } = parseName(basename(file))
  const title = fm.title ?? base
  const ctx = { file, vis }
  if (!suffix) warnings.push(`${file} no .pub/.pri suffix (mismatch, check-visibility fixes it to .pri.md)`)
  if (LETTER_PREFIX_RE.test(basename(file))) warnings.push(`${file} letter order prefix, digits only`)

  // folder chain, order prefixes stripped, folded below DEPTH
  let parent = addNode('dir_root', { label: basename(rootAbs), file_type: 'document', kind: 'folder', source_file: '', visibility: 'pri' })
  const rawParts = (dirname(file) === '.' ? [] : dirname(file).split('/')).slice(0, DEPTH)
  const parts = rawParts.map(stripOrder)
  parts.forEach((p, i) => {
    const path = parts.slice(0, i + 1).join('/')
    const order = rawParts[i].match(/^(\d+)\./)?.[1]
    const id = addNode(`dir_${toId(path)}`, {
      label: path, file_type: 'document', kind: 'folder', source_file: path, visibility: 'pri', slug: p, order: order ? Number(order) : null,
    })
    if (!links.some((l) => l.source === parent && l.target === id)) addLink(parent, id, 'contains', file)
    parent = id
  })

  // index.md is its folder's node; a pub/pri pair is one entity with two file children
  const paired = pairCount.get(entityKey(file)) > 1
  const slug = suffix === 'pri' ? `${base}-pri` : base
  const attrs = { label: title, file_type: 'document', kind: 'file', source_file: file, source_location: 'L1', visibility: vis, slug, order }
  let fileId
  if (base === 'index' && !paired) {
    fileId = parent
    const { slug: _s, order: _o, ...indexAttrs } = attrs // the folder keeps its own slug and order
    Object.assign(nodes.get(parent), indexAttrs, { kind: 'folder' })
  } else {
    const entityId = base === 'index' ? parent : `doc_${toId([...parts, base].join('/'))}`
    if (paired) {
      if (base !== 'index') addNode(entityId, { label: title, file_type: 'document', kind: 'entity', source_file: file, visibility: 'pri', order })
      if (base !== 'index' && !links.some((l) => l.source === parent && l.target === entityId)) addLink(parent, entityId, 'contains', file)
      fileId = addNode(`${entityId}__${suffix ?? 'md'}`, attrs)
      addLink(entityId, fileId, 'contains', file)
    } else {
      fileId = addNode(entityId, attrs)
      addLink(parent, fileId, 'contains', file)
    }
  }
  idByPath.set(abs, fileId)
  if (parts[0] === 'team' && parts.length === 1) teamIdByHandle.set(base, fileId)

  const { title: _t, description, ...fields } = fm
  if (description) nodes.get(fileId).description = String(description)
  addFields(fileId, title, fields, ctx)
  for (const role of [].concat(fm.roles ?? [])) {
    const roleId = addNode(`role_${toId(String(role))}`, { label: String(role), file_type: 'concept', kind: 'role', source_file: file, visibility: 'pri' })
    addLink(fileId, roleId, 'has_role', file, 1)
  }

  // body: heading stack h2..h6 under the file (level 1), list items under the current section
  const offset = m ? m[0].split('\n').length - 1 : 0
  const lines = text.slice(m ? m[0].length : 0).split('\n')
  const stack = [{ level: 1, id: fileId, label: title, node: nodes.get(fileId) }]
  let items = [] // [{ indent, id }] for nested list items
  let fence = false
  lines.forEach((line, i) => {
    const ln = i + 1 + offset
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return }
    if (fence) return
    const h = line.match(HEADING_RE)
    if (h) {
      const level = h[1].length
      const label = h[2]
      if (level === 1) { warnings.push(`${file}:${ln} h1 in body, h1 is the frontmatter title`); return }
      if (level > DEPTH) return // folded into the current section
      if (/^\d+\./.test(line)) warnings.push(`${file}:${ln} heading inside a numbered list`)
      while (stack.at(-1).level >= level) stack.pop().node.end = ln - 1
      if (level > stack.at(-1).level + 1) warnings.push(`${file}:${ln} h${level} skips a level`)
      const top = stack.at(-1)
      const id = addNode(`${top.id}__${toId(label)}`, {
        label: `${top.label} › ${label}`, file_type: 'document', kind: `h${level}`,
        source_file: file, start: ln, visibility: vis,
      })
      addLink(top.id, id, 'contains', file, ln)
      stack.push({ level, id, label: `${top.label} › ${label}`, node: nodes.get(id) })
      items = []
      return
    }
    const it = line.match(ITEM_RE)
    if (it) {
      const indent = it[1].replace(/\t/g, '  ').length
      while (items.length && items.at(-1).indent >= indent) items.pop()
      const parentId = items.at(-1)?.id ?? stack.at(-1).id
      const parentLabel = items.at(-1)?.label ?? stack.at(-1).label
      const short = it[2].replace(/\s+/g, ' ').slice(0, 60)
      const id = addNode(`${parentId}__l${ln}`, {
        label: `${parentLabel} › ${short}`, file_type: 'document', kind: 'item',
        source_file: file, start: ln, end: ln, visibility: vis, value: it[2],
      })
      addLink(parentId, id, 'contains', file, ln)
      items.push({ indent, id, label: `${parentLabel} › ${short}` })
    } else if (line.trim() && !/^\s/.test(line)) {
      items = [] // a paragraph ends the list
    }
    for (const [, target, anchor] of line.matchAll(LINK_RE)) {
      if (/^[a-z]+:/i.test(target)) continue
      const targetAbs = target.startsWith('/') ? join(rootAbs, target.replace(/^\/doc\//, '')) : resolve(dirname(abs), target)
      links.push(pendingRef(stack.at(-1).id, `${targetAbs}#${anchor ?? ''}`, file, ln))
    }
    // roll-up rows (`{type: task, ...}`) copy todos that live in other docs: no second edge
    if (!/\{type:/.test(line)) for (const [, rest] of line.matchAll(TODO_RE)) {
      for (const [, who] of rest.matchAll(/@([\w-]+)/g)) {
        const personId = addNode(`person_${toId(who)}`, { label: `@${who}`, file_type: 'concept', kind: 'person', source_file: file, visibility: 'pri' })
        addLink(stack.at(-1).id, personId, 'todo_for', file, ln)
      }
    }
  })
  const end = offset + lines.length
  while (stack.length) stack.pop().node.end ??= end
  for (const n of nodes.values()) if (n.source_file === file && n.start) n.source_location = `L${n.start}-L${n.end}`
}

// references resolved after all files exist: anchor → matching section, else the file
for (const l of links.filter((x) => x.pending)) {
  delete l.pending
  const [targetAbs, anchor] = l.target.split('#')
  const fileTarget = idByPath.get(targetAbs) ?? 'missing'
  const section = anchor && [...nodes.values()].find((n) => n.id.startsWith(`${fileTarget}__`) && toId(n.label.split(' › ').at(-1)) === toId(anchor))
  l.target = section ? section.id : fileTarget
  if (!nodes.has(l.target)) { warnings.push(`${l.source_file}:${l.source_location} broken link`); l.drop = true }
}

// person handles → team file of the same name
for (const p of [...nodes.values()].filter((n) => n.kind === 'person')) {
  const handle = p.label.slice(1).toLowerCase()
  const team = teamIdByHandle.get(HANDLE_ALIASES[handle] ?? handle)
  if (team) addLink(p.id, team, 'is', nodes.get(team).source_file)
}

const graph = {
  directed: true, multigraph: false, graph: {},
  nodes: [...nodes.values()].map(({ start, end, ...n }) => ({ ...n, norm_label: n.label.toLowerCase() })),
  links: links.filter((l) => !l.drop),
  hyperedges: [],
}
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(graph, null, 2))
console.log(`${files.length} files → ${graph.nodes.length} nodes, ${graph.links.length} links → ${outPath}`)
if (warnings.length) console.log(`${warnings.length} structure warnings:\n${warnings.map((w) => `  ${w}`).join('\n')}`)
