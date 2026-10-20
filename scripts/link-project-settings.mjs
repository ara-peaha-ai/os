#!/usr/bin/env node
// Merges the agent permissions of wisdom/.claude/settings.json into
// <project>/.claude/settings.json (the workspace folder holding every clone),
// so a Claude Code session started there loads the same rules as one started
// inside a repo (e.g. the agent's `gh pr merge` after a passing review).
// Only `permissions.allow` / `permissions.deny` are merged (union); every other key
// of the project file stays as is. The old file is kept as settings.json.bak-<ts>.
// Same command on a PC and on a VPS; safe to re-run.
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const wisdom = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const project = resolve(process.argv[2] || dirname(wisdom))
const src = JSON.parse(readFileSync(resolve(wisdom, '.claude/settings.json'), 'utf8'))
const dstPath = resolve(project, '.claude/settings.json')
const dst = existsSync(dstPath) ? JSON.parse(readFileSync(dstPath, 'utf8')) : {}

const union = (a = [], b = []) => [...new Set([...a, ...b])]
const merged = {
  ...dst,
  permissions: {
    ...dst.permissions,
    allow: union(dst.permissions?.allow, src.permissions?.allow),
    deny: union(dst.permissions?.deny, src.permissions?.deny)
  }
}

if (JSON.stringify(merged) === JSON.stringify(dst)) {
  console.log(`ok       ${dstPath}`)
} else {
  mkdirSync(dirname(dstPath), { recursive: true })
  if (existsSync(dstPath)) copyFileSync(dstPath, `${dstPath}.bak-${new Date().toISOString().replace(/[:.]/g, '')}`)
  writeFileSync(dstPath, JSON.stringify(merged, null, 2) + '\n')
  console.log(`merged   ${dstPath}`)
}
