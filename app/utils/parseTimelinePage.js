// Recognizes the "## Group\n- Date: text [link]()" convention already used in
// pages like verticals/001.realestate — zero new syntax to learn. Returns null
// (fall back to normal ContentRenderer) unless every line inside a `## ` section
// is a dated bullet.
export const parseTimelinePage = (rawbody) => {
  if (!rawbody) return null
  const body = rawbody.replace(/^---\n[\s\S]*?\n---\n?/, '')
  const h2Index = body.search(/^##\s+/m)
  if (h2Index === -1) return null

  const preamble = body.slice(0, h2Index).trim()
  const lines = body.slice(h2Index).split('\n')
  const groups = []
  let current = null

  for (const raw of lines) {
    const line = raw.trim()
    const h2 = line.match(/^##\s+(.+)/)
    if (h2) {
      current = { group: h2[1].trim(), items: [] }
      groups.push(current)
      continue
    }
    if (!line) continue
    const bullet = line.match(/^-\s+([^:]+):\s*(.+)/)
    if (!bullet || !current) return null
    current.items.push({ date: bullet[1].trim(), description: bullet[2].trim() })
  }

  if (!groups.length || groups.some(g => g.items.length === 0)) return null
  return { preamble, groups }
}
