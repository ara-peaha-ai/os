// Turns the Nuxt Content dump (dist/__nuxt_content/<collection>/sql_dump.txt:
// base64 of a gzipped JSON array of "SQL -- hash" lines) into a plain SQL file
// for `wrangler d1 execute --file`, ending with the checksum row marked ready.
// Importing in CI means the worker finds the database ready and never runs the
// import itself on a first request, where Workers limits can leave it half done
// with `ready = 0` and every content route hanging.
import { readFileSync, writeFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'

const [dumpPath, outPath] = process.argv.slice(2)
if (!dumpPath || !outPath) {
  console.error('usage: node scripts/d1-content-sql.mjs <sql_dump.txt> <out.sql>')
  process.exit(1)
}

const lines = JSON.parse(gunzipSync(Buffer.from(readFileSync(dumpPath, 'utf8'), 'base64')).toString('utf8'))
const stripHash = line => line.slice(0, line.lastIndexOf(' -- ')).trim().replace(/;$/, '') + ';'
const checksumId = lines.map(l => l.match(/INSERT INTO _content_info VALUES \('([^']+)'/)?.[1]).find(Boolean)
if (!checksumId) {
  console.error('no _content_info checksum row in the dump')
  process.exit(1)
}

const sql = [
  // the dump's own CREATE comes first; a stale checksum row would clash with its INSERT
  stripHash(lines[0]),
  `DELETE FROM _content_info WHERE id = '${checksumId}';`,
  ...lines.slice(1).map(stripHash),
  `UPDATE _content_info SET ready = true WHERE id = '${checksumId}';`
]
writeFileSync(outPath, sql.join('\n') + '\n')
console.log(`${sql.length} statements -> ${outPath}`)
