---
name: pr-workflow
description: "How agents handle an open pull request. A status ask on a PR (\"status? <PR link>\") runs the full fix loop (verify findings, fix, push through the owner's commit flow, resolve threads, check merge-ready) instead of returning a report. Use whenever someone asks about a PR's state or review findings."
---

# PR workflow

## PR status = fix loop, not a report

A status question on a PR (`status? <PR link>` or similar) runs the whole loop
without further questions; a bare report is not an answer.

1. Read the state: checks, the `merge-ready` comment, unresolved review threads,
   reviewer verdicts and the commit each one is on.
2. Every unresolved thread and every failing check is a finding: verify it
   against the code, fix what is real, note false positives with one line of
   evidence.
3. Work in a worktree on the PR branch, never in a checkout holding someone
   else's uncommitted work.
4. A reviewer `fail` on an older commit counts as addressed once its findings
   are fixed; no re-run unless the owner asks.
5. Prepare the commit and push through the owner's usual commit flow (the agent
   never pushes on its own), then resolve the threads, post the verdict and
   check `merge-ready`.
6. Nothing open: one line of status plus the PR link.
