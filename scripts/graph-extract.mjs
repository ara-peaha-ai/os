// Deterministic graph of a markdown tree, no LLM: folders, files, h2-h6 sections
// (h1 = frontmatter title), list items, frontmatter keys and every non-.md file (media) become nodes.
// Writes graphify's node-link graph.json, so `graphify cluster-only`, `query`,
// `path` and `explain` run on our structure instead of an LLM guess.
// The graph keeps private content (visibility is a node attribute, filtered at
// retrieval): never publish graph.json or graph.html of a private tree.
// Tree rules: sovereign content/original/doc/002.development/011.ai/claude.pri.md#content-tree
// Design: sovereign content/original/doc/002.development/011.ai/context-engine.pri.md
// usage: node scripts/graph-extract.mjs <content dir> [out graph.json] [--depth N]
//   --depth N: folders down to level N and headings down to hN (default 6); deeper content
//   folds into its level-N node, nothing is dropped
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, relative, dirname, resolve, basename, extname } from 'node:path'
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

// accents folded, anything else non-alphanumeric → `_`; collisions are resolved by uniqueNode
const toId = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'x'
// shared nodes (folders, entities): same id = same thing
const addNode = (id, attrs) => {
  if (!nodes.has(id)) nodes.set(id, { id, ...attrs })
  return id
}
// own nodes (files, sections, fields, items): never merged into an existing one
const uniqueNode = (id, attrs) => {
  let unique = id
  for (let n = 2; nodes.has(unique); n++) unique = `${id}_${n}`
  nodes.set(unique, { id: unique, ...attrs })
  return unique
}
const addLink = (source, target, relation, file, line) => links.push({
  source, target, relation, confidence: 'EXTRACTED', confidence_score: 1.0, weight: 1.0,
  source_file: file, source_location: line ? `L${line}` : null,
})

const FRONTMATTER_RE = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/
const HEADING_RE = /^(?:\d+\.\s+)?(#{1,6})\s+(.+?)\s*#*\s*$/ // `##todo` has no space: not a heading
const ANCHOR_ID_RE = /\s*\{#([\w-]+)\}\s*$/ // `## Spike #est 2h {#spike}`
const ITEM_RE = /^(\s*)(?:[-*+]|\d+\.)\s+(.+)$/
const BREAK_RE = /^\s*([-*_])(\s*\1){2,}\s*$/ // `* * *`, `---`: thematic break, not an item
const FENCE_RE = /^\s*(`{3,}|~{3,})/
const LINK_RE = /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)

// public only with share AND public exactly true; a flag falls back to the suffix only when
// every alias is absent (same rule as sovereign scripts/check-visibility.mjs)
const visibility = (file, fm) => {
  const pub = /\.pub\.[^.]+$/.test(file)
  const flag = (keys) => {
    const key = keys.find((k) => Object.hasOwn(fm, k))
    return key === undefined ? pub : fm[key] === true
  }
  return flag(['share', 'shared', 'publish']) && flag(['public', 'published']) ? 'pub' : 'pri'
}

// `001.giovanni.pri.md` → order 1, base `giovanni`, suffix `pri`; letter prefixes (`00A.`) stay in the base
const NAME_RE = /^(?:(\d+)\.)?(.+?)(?:\.(pub|pri))?\.md$/
const LETTER_PREFIX_RE = /^\d+[a-z]\w*\./i
const parseName = (name) => {
  const m = name.match(NAME_RE)
  if (!m) return { order: null, base: name.replace(/\.md$/, '') || 'x', suffix: null }
  return { order: m[1] ? Number(m[1]) : null, base: m[2], suffix: m[3] ?? null }
}
const stripOrder = (dir) => dir.replace(/^\d+\./, '')
const groupBy = (list, key) => list.reduce((acc, x) => acc.set(key(x), [...(acc.get(key(x)) ?? []), x]), new Map())

// sorted for a deterministic graph; dot files and folders, node_modules and non-regular files skipped
const walk = (dir) => readdirSync(dir, { withFileTypes: true })
  .filter((e) => !e.name.startsWith('.') && e.name !== 'node_modules')
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap((e) => e.isDirectory() ? walk(join(dir, e.name)) : e.isFile() ? [join(dir, e.name)] : [])

// frontmatter value → nested field nodes; arrays of scalars stay one value (tags: [red, blue]),
// a list of one-key maps with distinct keys reads as one map (sizes: [{dress: M}, {shoes: 37}])
const addFields = (parentId, parentLabel, value, ctx) => {
  for (const [key, v] of Object.entries(value)) {
    if (UNSAFE_KEYS.has(key)) continue
    const label = `${parentLabel} › ${key}`
    const id = uniqueNode(`${parentId}__f_${toId(key)}`, {
      label, file_type: 'concept', kind: 'field', source_file: ctx.file, source_location: 'L1', visibility: ctx.vis,
    })
    addLink(parentId, id, 'contains', ctx.file)
    if (Array.isArray(v) && v.every((x) => !isPlainObject(x) && !Array.isArray(x))) {
      nodes.get(id).value = v.map((x) => (x instanceof Date ? x.toISOString().slice(0, 10) : String(x ?? ''))).join(', ')
    } else if (Array.isArray(v)) {
      const keys = v.flatMap((x) => (isPlainObject(x) ? Object.keys(x) : []))
      const oneKeyMaps = v.every((x) => isPlainObject(x) && Object.keys(x).length === 1) && new Set(keys).size === keys.length
      const asMap = oneKeyMaps ? Object.fromEntries(v.flatMap((x) => Object.entries(x))) : Object.fromEntries(v.map((x, i) => [`[${i}]`, x]))
      addFields(id, label, asMap, ctx)
    } else if (isPlainObject(v)) {
      addFields(id, label, v, ctx)
    } else {
      nodes.get(id).value = v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? '')
    }
  }
}

const rootAbs = resolve(root)
const all = walk(rootAbs)
const files = all.filter((f) => f.endsWith('.md'))
const media = all.filter((f) => !f.endsWith('.md')) // photos, videos, pdf, models...: nodes without a body
const idByPath = new Map() // absolute path → node id, for link resolution
const pending = [] // links resolved after every file is parsed
const entityKey = (file) => `${dirname(file)}/${parseName(basename(file)).base}`
const byEntity = groupBy(files.map((abs) => relative(rootAbs, abs)), entityKey)

// folder chain of a file, order prefixes stripped, folded below DEPTH → id of its deepest folder node
const folderOf = (file) => {
  let parent = addNode('dir_root', { label: basename(rootAbs), file_type: 'document', kind: 'folder', source_file: '', visibility: 'pri' })
  const rawParts = (dirname(file) === '.' ? [] : dirname(file).split('/')).slice(0, DEPTH)
  const parts = rawParts.map(stripOrder)
  parts.forEach((p, i) => {
    const path = rawParts.slice(0, i + 1).join('/')
    const folderOrder = rawParts[i].match(/^(\d+)\./)?.[1]
    const isNew = !nodes.has(`dir_${toId(path)}`)
    const id = addNode(`dir_${toId(path)}`, {
      label: parts.slice(0, i + 1).join('/'), file_type: 'document', kind: 'folder', source_file: path, visibility: 'pri',
      slug: p, order: folderOrder ? Number(folderOrder) : null,
    })
    if (isNew) addLink(parent, id, 'contains', path)
    parent = id
  })
  return parent
}

// media: `foo.jpg`, `foo.mp4` are one thing `foo` (the extension is only its type, an attribute);
// `foo.<role>[.pub|.pri].md` in the same folder are its cards (`foo.description.pub.md`, `foo.transcript.md`).
// No reserved role names: a .md is a card only when a media with its stem sits next to it.
const mediaThing = new Map() // `<dir>/<stem>` → { id }  (media visibility: always pri, a card never changes it)
for (const abs of media) {
  const file = relative(rootAbs, abs)
  const ext = extname(file)
  const key = join(dirname(file), basename(file, ext))
  if (!mediaThing.has(key)) {
    const id = uniqueNode(`thing_${toId(key)}`, { label: basename(key), file_type: 'document', kind: 'media', source_file: file, visibility: 'pri' })
    addLink(folderOf(file), id, 'contains', file)
    mediaThing.set(key, { id })
  }
  const thing = mediaThing.get(key)
  const id = uniqueNode(`media_${toId(file)}`, {
    label: basename(file), file_type: 'document', kind: 'media_file', source_file: file, visibility: 'pri', ext: ext.slice(1).toLowerCase(),
  })
  addLink(thing.id, id, 'contains', file)
  idByPath.set(abs, id)
}
// `foo.description.pri.md` → card of `foo` with role `description`; `foo.pub.md` → card of `foo` without a role
const cardOf = (file) => {
  const stem = basename(file).replace(/(\.(pub|pri))?\.md$/, '')
  const whole = mediaThing.get(join(dirname(file), stem))
  if (whole) return { thing: whole, role: null }
  const dot = stem.lastIndexOf('.')
  const thing = dot > 0 && mediaThing.get(join(dirname(file), stem.slice(0, dot)))
  return thing ? { thing, role: stem.slice(dot + 1) } : null
}

for (const abs of files) {
  const file = relative(rootAbs, abs)
  let text
  try { text = readFileSync(abs, 'utf8').replace(/^﻿/, '') } catch (e) { warnings.push(`${file}: not read (${e.message})`); continue }
  const m = text.match(FRONTMATTER_RE)
  let fm = {}
  try {
    const loaded = m ? yaml.load(m[1]) : null
    if (loaded != null && !isPlainObject(loaded)) warnings.push(`${file}: frontmatter is not a mapping, ignored`)
    else if (loaded) fm = loaded
  } catch (e) { warnings.push(`${file}: frontmatter not parsed (${e.reason ?? e.message})`) }
  const vis = visibility(file, fm)
  const { order, base, suffix } = parseName(basename(file))
  const title = fm.title != null ? String(fm.title instanceof Date ? fm.title.toISOString().slice(0, 10) : fm.title) : base
  const ctx = { file, vis }
  if (!suffix) warnings.push(`${file} no .pub/.pri suffix (mismatch, check-visibility fixes it to .pri.md)`)
  if (LETTER_PREFIX_RE.test(basename(file))) warnings.push(`${file} letter order prefix, digits only`)

  const card = cardOf(file)
  const parent = card ? card.thing.id : folderOf(file)

  // index.md is its folder's node; a pub/pri pair is one entity with two file children
  // a pair is exactly one .pub.md + one .pri.md; same suffix twice = same slug
  const siblings = byEntity.get(entityKey(file)).map((f) => parseName(basename(f)).suffix)
  const paired = siblings.length === 2 && siblings.includes('pub') && siblings.includes('pri')
  if (!paired && siblings.length > 1 && siblings.indexOf(suffix) !== siblings.lastIndexOf(suffix)) warnings.push(`${file} same slug as a sibling (${base}${suffix === 'pri' ? '-pri' : ''})`)
  const slug = suffix === 'pri' ? `${base}-pri` : base
  const attrs = { label: title, file_type: 'document', kind: card ? 'card' : 'file', source_file: file, source_location: 'L1', visibility: vis, slug, order, ...(card?.role && { role: card.role }) }
  const fileKey = `doc_${toId(file.replace(/\.md$/, ''))}`
  let fileId
  if (base === 'index' && !paired) {
    fileId = parent
    const { slug: _s, order: _o, ...indexAttrs } = attrs // the folder keeps its own slug and order
    Object.assign(nodes.get(parent), indexAttrs, { kind: 'folder' })
  } else if (paired) {
    const entityId = base === 'index' ? parent : `ent_${toId(entityKey(file))}`
    if (base !== 'index' && !nodes.has(entityId)) {
      addNode(entityId, { label: title, file_type: 'document', kind: 'entity', source_file: file, visibility: 'pri', order })
      addLink(parent, entityId, 'contains', file)
    }
    if (base !== 'index' && suffix === 'pub') Object.assign(nodes.get(entityId), { label: title, source_file: file }) // public title names the entity
    fileId = uniqueNode(fileKey, attrs)
    addLink(entityId, fileId, 'contains', file)
  } else {
    fileId = uniqueNode(fileKey, attrs)
    addLink(parent, fileId, 'contains', file)
  }
  idByPath.set(abs, fileId)

  const { title: _t, description, ...fields } = fm
  if (description != null) nodes.get(fileId).description = String(description)
  addFields(fileId, title, fields, ctx)

  // body: heading stack h2..h6 under the file (level 1), list items under the current section
  const offset = m ? m[0].split('\n').length - 1 : 0
  const lines = text.slice(m ? m[0].length : 0).split('\n')
  const stack = [{ level: 1, id: fileId, label: title, node: nodes.get(fileId) }]
  let items = [] // [{ indent, id, label }] for nested list items
  let fence = null // { char, length } of the open code fence
  let comment = false
  lines.forEach((line, i) => {
    const ln = i + 1 + offset
    const f = line.match(FENCE_RE)
    if (fence) {
      if (f && f[1][0] === fence.char && f[1].length >= fence.length && !line.trim().slice(f[1].length).trim()) fence = null
      return
    }
    if (f) { fence = { char: f[1][0], length: f[1].length, line: ln }; return }
    if (comment || /^\s*<!--/.test(line)) { comment = !line.includes('-->'); return }

    let source = stack.at(-1).id // what links on this line belong to
    const h = line.match(HEADING_RE)
    if (h && h[1].length === 1) warnings.push(`${file}:${ln} h1 in body, h1 is the frontmatter title`)
    if (h && h[1].length > 1 && h[1].length <= DEPTH) {
      const level = h[1].length
      const anchorId = h[2].match(ANCHOR_ID_RE)?.[1]
      const heading = h[2].replace(ANCHOR_ID_RE, '')
      if (/^\d+\./.test(line)) warnings.push(`${file}:${ln} heading inside a numbered list`)
      while (stack.at(-1).level >= level) stack.pop().node.end = ln - 1
      if (level > stack.at(-1).level + 1) warnings.push(`${file}:${ln} h${level} skips a level`)
      const top = stack.at(-1)
      const label = `${top.label} › ${heading}`
      const id = uniqueNode(`${top.id}__s_${toId(heading)}`, {
        label, file_type: 'document', kind: `h${level}`, source_file: file, start: ln, visibility: vis, heading, anchor_id: anchorId,
      })
      addLink(top.id, id, 'contains', file, ln)
      stack.push({ level, id, label, node: nodes.get(id) })
      items = []
      source = id
    } else if (!h) {
      const it = !BREAK_RE.test(line) && line.match(ITEM_RE)
      if (it) {
        const indent = it[1].replace(/\t/g, '    ').length
        while (items.length && items.at(-1).indent >= indent) items.pop()
        const parentId = items.at(-1)?.id ?? stack.at(-1).id
        const parentLabel = items.at(-1)?.label ?? stack.at(-1).label
        const short = it[2].replace(/\s+/g, ' ').slice(0, 60)
        const id = uniqueNode(`${parentId}__l${ln}`, {
          label: `${parentLabel} › ${short}`, file_type: 'document', kind: 'item',
          source_file: file, start: ln, end: ln, visibility: vis, value: it[2],
        })
        addLink(parentId, id, 'contains', file, ln)
        items.push({ indent, id, label: `${parentLabel} › ${short}` })
        source = id
      } else if (line.trim() && !/^\s/.test(line)) {
        items = [] // a paragraph ends the list
      }
    } // folded headings (deeper than DEPTH) and body h1 stay text of the current section

    const prose = line.replace(/`[^`]*`/g, '') // inline code is an example, not a link
    for (const [, dest] of prose.matchAll(LINK_RE)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(dest)) continue
      const [rawPath, anchor = ''] = dest.split('#')
      let path = rawPath
      try { path = decodeURIComponent(rawPath) } catch { /* malformed escape: keep it as written */ }
      if (path && !extname(path)) continue // site routes (`/insights/x`) are not file paths
      const targetAbs = !path ? abs : path.startsWith('/') ? join(rootAbs, path.replace(/^\/doc\//, '')) : resolve(dirname(abs), path)
      pending.push({ source, targetAbs, anchor, file, ln })
    }
  })
  if (fence) warnings.push(`${file}:${fence.line} code fence never closed, the rest of the file was skipped`)
  const end = offset + lines.length
  while (stack.length) stack.pop().node.end ??= end
  for (const n of nodes.values()) if (n.source_file === file && n.start) n.source_location = `L${n.start}-L${n.end}`
}

// anchor → heading with that `{#id}`, else the heading whose text slugs the same, else the file
const headingsByFile = groupBy([...nodes.values()].filter((n) => /^h\d$/.test(n.kind)), (n) => n.source_file)
for (const p of pending) {
  const fileTarget = idByPath.get(p.targetAbs)
  if (!fileTarget) { warnings.push(`${p.file}:L${p.ln} broken link`); continue }
  const headings = headingsByFile.get(relative(rootAbs, p.targetAbs)) ?? []
  const section = p.anchor && (headings.find((n) => n.anchor_id === p.anchor) ?? headings.find((n) => toId(n.heading) === toId(p.anchor)))
  if (p.anchor && !section) warnings.push(`${p.file}:L${p.ln} anchor #${p.anchor} not found, linked to the file`)
  addLink(p.source, section ? section.id : fileTarget, 'references', p.file, p.ln)
}

// graphify loads a DiGraph: one edge per ordered pair, so the structural one wins and repeats are counted
const PRIORITY = ['contains', 'references']
const edges = new Map()
for (const l of links) {
  const key = `${l.source}\u0000${l.target}`
  const kept = edges.get(key)
  if (!kept) edges.set(key, { ...l, count: 1 })
  else if (PRIORITY.indexOf(l.relation) < PRIORITY.indexOf(kept.relation)) edges.set(key, { ...l, count: kept.count + 1 })
  else kept.count++
}

const graph = {
  directed: true, multigraph: false, graph: {},
  nodes: [...nodes.values()].map(({ start, end, ...n }) => ({ ...n, norm_label: n.label.toLowerCase() })),
  links: [...edges.values()],
  hyperedges: [],
}
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(graph, null, 2))
console.log(`${files.length} md + ${media.length} media files → ${graph.nodes.length} nodes, ${graph.links.length} links → ${outPath}`)
if (warnings.length) console.log(`${warnings.length} structure warnings:\n${warnings.map((w) => `  ${w}`).join('\n')}`)
