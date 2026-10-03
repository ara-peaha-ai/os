// Names graphify communities after their dominant doc, so the HTML shows
// "Swiss Verein · operations/licenses" instead of "Community 148".
// Run after `graphify cluster-only <dir> --no-viz`: names the communities already in
// graph.json and draws graph.html with graphify's own renderer. Re-running cluster-only
// would reshuffle the communities (not deterministic), so the HTML is drawn from these.
// usage: node scripts/graph-labels.mjs <dir>/graphify-out
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'

const out = process.argv[2]
if (!out) {
  console.error('usage: node scripts/graph-labels.mjs <dir>/graphify-out')
  process.exit(1)
}
const { nodes } = JSON.parse(readFileSync(join(out, 'graph.json'), 'utf8'))
const titleByFile = new Map(nodes.filter((n) => ['file', 'folder'].includes(n.kind) && n.source_file).map((n) => [n.source_file, n.label]))
const byCommunity = Map.groupBy(nodes.filter((n) => n.community != null), (n) => n.community)

const used = new Map()
const labels = Object.fromEntries([...byCommunity].map(([cid, members]) => {
  const counts = Map.groupBy(members.filter((n) => n.source_file), (n) => n.source_file)
  const [top] = [...counts].sort((a, b) => b[1].length - a[1].length)[0] ?? ['']
  const folder = dirname(top).split('/').map((p) => p.replace(/^\d+\./, '')).filter((p) => p !== '.').join('/')
  const base = [titleByFile.get(top) ?? top, folder].filter(Boolean).join(' · ') || `Community ${cid}`
  const n = (used.get(base) ?? 0) + 1
  used.set(base, n)
  return [cid, n > 1 ? `${base} (${n})` : base]
}))
writeFileSync(join(out, '.graphify_labels.json'), JSON.stringify(labels, null, 2))
console.log(`${Object.keys(labels).length} communities named → ${join(out, '.graphify_labels.json')}`)

// graphify is a Python package: its renderer runs in graphify's own interpreter
const python = readFileSync(execFileSync('which', ['graphify']).toString().trim(), 'utf8').split('\n')[0].slice(2)
execFileSync(python, ['-c', `
import json, sys
from collections import defaultdict
from networkx.readwrite import json_graph
from graphify.export import to_html
out = sys.argv[1]
data = json.load(open(out + '/graph.json'))
try:
    G = json_graph.node_link_graph(data, edges='links')
except TypeError:
    G = json_graph.node_link_graph(data)
communities = defaultdict(list)
for n, attrs in G.nodes(data=True):
    if attrs.get('community') is not None:
        communities[int(attrs['community'])].append(n)
labels = {int(k): v for k, v in json.load(open(out + '/.graphify_labels.json')).items()}
to_html(G, dict(communities), out + '/graph.html', community_labels=labels)
`, out], { stdio: 'inherit' })
console.log(`graph.html → ${join(out, 'graph.html')}`)
