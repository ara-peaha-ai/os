// Turns the Nuxt Content dumps (dist/__nuxt_content/<collection>/sql_dump.txt:
// base64 of a gzipped JSON array of "SQL -- hash" lines) into one plain SQL file
// for `wrangler d1 execute --file`, each checksum row ending up ready.
// The deploy workflows run it because the worker's own first-request import is
// off (integrityCheck: false in nuxt.config.js): under Workers limits it could
// stop halfway and leave `ready = 0`.
import { readFileSync, writeFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'

const [outPath, ...dumpPaths] = process.argv.slice(2)
if (!outPath || !dumpPaths.length) {
  console.error('usage: node scripts/d1-content-sql.mjs <out.sql> <sql_dump.txt>...')
  process.exit(1)
}

const stripHash = line => line.slice(0, line.lastIndexOf(' -- ')).trim().replace(/;$/, '') + ';'

// Rebuilt from scratch, as the worker does when @nuxt/content's database version
// changes: an old _content_info layout would otherwise reject the new INSERTs.
const sql = ['DROP TABLE IF EXISTS _content_info;']
for (const dumpPath of dumpPaths) {
  const lines = JSON.parse(gunzipSync(Buffer.from(readFileSync(dumpPath, 'utf8'), 'base64')).toString('utf8'))
  const checksumId = lines.map(l => l.match(/INSERT INTO _content_info VALUES \('([^']+)'/)?.[1]).find(Boolean)
  if (!checksumId) {
    console.error(`no _content_info checksum row in ${dumpPath}`)
    process.exit(1)
  }
  sql.push(...lines.map(stripHash), `UPDATE _content_info SET ready = true WHERE id = '${checksumId}';`)
}
writeFileSync(outPath, sql.join('\n') + '\n')
console.log(`${dumpPaths.length} dump(s), ${sql.length} statements -> ${outPath}`)
