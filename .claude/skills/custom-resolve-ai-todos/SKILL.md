---
name: custom-resolve-ai-todos
description: "Scans input text for \"##todo @ai\" markers (also matches \"@claude\" or equivalent assistant-directed tags) and \"#master\" propagation tags, executes each, and reprints the file with those markers resolved in place. Does NOT touch anything else in the file. Trigger: \"resolve todos\", \"esegui i todo\", \"solve the @ai todos\", or any pasted text containing \"##todo @ai\" or \"#master\"."
trigger: /resolve-ai-todos
---

# /resolve-ai-todos

## Role
You are not a reviewer, you are a doer. Every `##todo @ai ...` marker in the input is a direct instruction addressed to you. Find each one, carry it out, and write the result back exactly where the marker was. You are not a summarizer of the file either — everything outside the markers stays byte-for-byte untouched, `#master` tags included (see below).

## Detection
Scan for these tags, same line/cell, any order/spacing, or as YAML frontmatter keys:

- **Todo marker**: a `##todo … todo##` span (grammar in the `tag-syntax` skill) carrying an assistant tag (`@ai`, `@claude`, or an obvious equivalent) and an instruction: everything between the flags and the `todo##` closer, across paragraphs when the span covers several. A `##todo` with no `todo##` is not a command: report it, never execute it.
- **Master tag**: `#master` (bare or `true`) or `master: true` in frontmatter — declares the tagged line/file/repo name canonical. Optionally scoped: a path right after it (`#master /01.business`, or `slaves: /01.business`) limits a naming master to that subtree; a language code or comma list (`#master IT`, `#master IT,EN`, or `slaves: IT` / `slaves: [IT, EN]`) limits a language master to those languages. No scope = everywhere.
- **Priority**: `#pri N` — when resolving several todos in one pass, do lower N first. Informational only, not itself a marker to resolve.
- **Unconfirmed marker**: `#?` — flags a specific word, figure, or claim inline in running prose as unconfirmed/needs verification, without interrupting the sentence the way stopping to open a `##todo` would. Place it directly after the unconfirmed item (e.g. `marketed as a cooperative #?`, `Ontario #?`). It carries no assistant tag and is not an action to execute — don't try to "resolve" it by researching or guessing an answer. It only goes away once the fact is confirmed from a primary source (the user, a lawyer, the relevant authority); at that point just delete the `#?`, there's no `##todo`→`#done` rename since nothing was *done*, something was *confirmed*. Supersedes the older bare `(?)` convention — use `#?` in new or edited content.

**Joint markers are not executed.** A `##todo` that carries an assistant tag **and** a human handle (`@claude @owner`, `@owner @cto @claude`, ...) is joint work, started only when the human decides (see the `tag-syntax` skill). Never perform it or rename it to `#done`: list it under a separate "Joint, not resolved" heading in the output. Only assistant-only markers are executed.

A line can carry `##todo @ai` and `#master` together — that's the common case (e.g. `# acme/pay ##todo @ai #master true #pri 1`): the `#master` tag *is* the instruction, telling you what to do.

## Execution

**Plain todo** (`##todo @ai ...` with no `#master`): follow the original flow.
1. Read the instruction and actually perform it: research (web search, docs, codebase), explain, define, decide, compare — whatever it asks. Use whatever tools the task needs.
2. Once done, **rename the marker `##todo` to `#done` and drop its `todo##` closer** (a done item is a plain tag, no longer a command), **keeping every suffix as-is** (the assistant tag — `@ai`, `@claude`, `@owner`, or whichever combination was present — and `#pri N` if present). Replace the original instruction text that followed the marker with the outcome, written to fit naturally into the surrounding sentence, bullet, or table cell — same tone and register as the surrounding text. The marker itself is never deleted; it becomes the in-place audit trail of what was asked and resolved.
3. Keep the answer as compact as the spot allows. A table cell gets a phrase, not a paragraph; a bullet gets a sentence or two if the topic needs it. Do not turn a one-line todo into a new subsection unless the instruction explicitly asks for a structural addition.
4. If other unresolved content in the file is needed as context for a todo (e.g. a `(?)` next to a tool name, an open question in a nearby cell), read it and factor it in.
5. This `##todo` → `#done` rule applies any time a todo of this kind is executed, not only when this skill is explicitly invoked via `/resolve-ai-todos` — e.g. when the user points at a specific `##todo @ai` in conversation and asks to run it.

**Master todo** (`##todo @ai` co-located with `#master`): the instruction is "make this canonical and propagate it," scoped as declared.
1. **Naming master** (line/heading declares a name, e.g. a repo name): find every occurrence of the current (old) name within the declared scope (a path, or every known repo/file if unscoped) — filenames, directory names, README headings, doc cross-references, and git remotes/GitHub repo settings if applicable.
2. Build a concrete rename plan (old → new, per file/remote) and show it to the user before touching anything that is hard to reverse or externally visible — renaming a directory that's a git repo, changing a `git remote`, renaming a GitHub repository, editing published docs. Get explicit confirmation for those specifically; purely local text edits (in-repo references, non-remote doc files) can proceed without re-asking once the overall plan is confirmed once.
3. Execute the confirmed renames. Leave the `#master` tag (and its scope) in place on the line — it's a durable declaration, not a one-shot todo — but rename the now-resolved `##todo @ai` (keeping the assistant tag and `#pri N` if present) to `#done @ai`, since that action item is done.
4. **Language master**: the file (or line's content) carrying `#master` is the source-of-truth language version. For each target slave language in scope (explicit list, or every other known language of the same content structure if unscoped), regenerate/expand the corresponding slave file or section from the master content — create it if missing, overwrite the stale part if present. Show the user which slave files will be created/overwritten before writing more than one file. Same marker rule: `#master` (+ scope) stays, `##todo @ai` (+ `#pri N`) becomes `#done @ai` (+ `#pri N`) once every in-scope slave is updated.

## When a task can't be completed
Don't fabricate. If a todo needs a decision only the user can make, information you have no access to, or is genuinely ambiguous, leave the `##todo @ai` (and, for a master todo, the `#master` tag) in place but rewrite the instruction into a precise, specific blocking question — never a vague "clarify this". State what you tried or found, if anything, before the open question.

## Untouched-content rule
Nothing changes outside the markers: no rewording, no re-formatting, no fixing unrelated typos, no reorganizing. A `#master` tag with no accompanying `##todo` is not resolved or removed — it's a standing declaration, leave it exactly as-is. Same for `#?`: leave it in place unless the specific fact it flags is being confirmed right now (by the user, in this pass) — don't remove it on a guess, and don't treat it as a `##todo` to research. If a todo's answer is genuinely one word or "no" / "yes", write just that — don't pad it into a sentence to look complete.

## Metadata and language
Frontmatter (YAML/TOML) and all structural elements (headings, table columns, list nesting) are preserved intact. For a plain todo, output in the same language as the input file (not the instruction's language, if different). For a language-master todo, the output languages are exactly the slave targets in scope — the master file's own language never changes.

## Output
1. First, the complete file, markers resolved, inside a ```markdown code block — copy-paste ready, no other changes. For a language-master todo that touches other files, print each updated file in its own labeled code block instead.
2. After the block(s), one line per marker processed: what was resolved (or created/renamed, for a master todo), or what blocking question was left open. No other commentary.
