#!/usr/bin/env node
// Merges the agent permissions of wisdom/.claude/settings.json into
// <project>/.claude/settings.json (the workspace folder holding every clone),
// so a Claude Code session started there loads the same rules as one started
// inside a repo (e.g. the agent's `gh pr merge` after a passing review).
// Only `permissions.allow` / `permissions.deny` are merged (union); every other key
// of the project file stays as is. The old file is kept as settings.json.bak-<ts>.
// Same command on a PC and on a VPS; safe to re-run.
// ponytail: union only, a rule removed from wisdom stays here; track a managed subset if that bites.
// Usage: node scripts/link-project-settings.mjs <project>
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, renameSync, chmodSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const wisdom = resolve(dirname(fileURLToPath(import.meta.url)), '..')
if (!process.argv[2]) { console.error('usage: link-project-settings.mjs <project>'); process.exit(1) }
const project = resolve(process.argv[2])
// ~/.claude/settings.json would apply the agent's rules in every folder
if (project === resolve(homedir())) { console.error(`refusing: ${project} is the home folder`); process.exit(1) }
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
  if (existsSync(dstPath)) {
    const backup = `${dstPath}.bak-${new Date().toISOString().replace(/[:.]/g, '')}`
    copyFileSync(dstPath, backup)
    chmodSync(backup, 0o600)
  }
  // temp file + rename: Claude Code reloads settings on change and must never read a half-written file
  writeFileSync(`${dstPath}.tmp`, JSON.stringify(merged, null, 2) + '\n', { mode: 0o600 })
  renameSync(`${dstPath}.tmp`, dstPath)
  console.log(`merged   ${dstPath}`)
}
