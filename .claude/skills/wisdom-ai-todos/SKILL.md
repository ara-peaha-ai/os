---
name: wisdom-ai-todos
description: Scans input text for "#todo @ai" markers (also matches "@claude" or equivalent assistant-directed tags), executes each requested task, and update the repo with those tasks resolved in place. Does NOT touch anything else in the file. Trigger: "resolve todos", "resuélves tareas", "risolvi todo", "solve the @ai todos", or any pasted text containing "#todo @ai".
---
# Resolve todos in place

## Parameters
`#todo` marks an action needed, requested by a human team member or by an AI agent.
Who acts depends on the mix of handles on the marker (see the `tag-syntax` skill):

- **Assistant only** (`@ai` / `@claude`, no human handle): resolved by this skill.
- **Assistant + human** (`@claude @<human>`, ...): worked jointly, only when the human decides to start. This skill may research and prepare, but never resolves it: the marker stays and is listed as reported.
- **Human only**: left byte-for-byte untouched.

An optional priority tag can appear on the same line as the marker, in the form `#todo @ai #pri 2`: `#pri 1` (high priority), `#pri 2` (medium priority), `#pri 3` (low priority). The legacy form `!1`/`!2`/`!3` is read the same way. If no priority tag is present, the default is `#pri 1`.

By default, process only `#pri 1` (high priority) todos. Process `#pri 2` and/or `#pri 3` todos only if the user explicitly asks — e.g. "risolvimi i todo a bassa priorità o a priorità 3", "risolvi tutti i todo indipendentemente dalla priorità", or equivalent phrasing. Todos left unprocessed due to the priority filter are listed separately at the end of the task list (see ## Output).

## Role
You are not a reviewer, you are a doer. Every assistant-only `#todo @ai ...` marker in the input is a direct instruction addressed to you. Find each one, carry it out, and write the result back exactly where the marker was. You are not a summarizer of the file either — everything outside the markers stays byte-for-byte untouched.

## Detection
A marker is any occurrence of `#todo` followed (same line, any order/spacing) by an assistant tag — `@ai`, `@claude`, or an obvious equivalent — followed by an instruction. The instruction runs to the end of the line, sentence, or cell it appears in (respect the surrounding syntax: don't swallow a table's closing `|`, a list item's line break, etc.).

## Execution
For each marker, in order:
1. Read the instruction and actually perform it: research (web search, docs, codebase), explain, define, decide, compare — whatever it asks. Use whatever tools the task needs.
2. Replace the entire marker (`#todo @ai ...` included) with the outcome, written to fit naturally into the surrounding sentence, bullet, or table cell — same tone and register as the surrounding text.
3. Keep the answer as compact as the spot allows. A table cell gets a phrase, not a paragraph; a bullet gets a sentence or two if the topic needs it. Do not turn a one-line todo into a new subsection unless the instruction explicitly asks for a structural addition (e.g. "add a table", "add a section").
4. If other unresolved content in the file is needed as context for a todo (e.g. a `(?)` next to a tool name, an open question in a nearby cell), read it and factor it in — a todo does not live in isolation from its row.

## When a task can't be completed
Don't fabricate. If a todo needs a decision only the user can make, information you have no access to, or is genuinely ambiguous, leave a `#todo @ai` marker in place but rewrite the instruction into a precise, specific blocking question — never a vague "clarify this". State what you tried or found, if anything, before the open question.

## Untouched-content rule
Nothing changes outside the markers: no rewording, no re-formatting, no fixing unrelated typos, no reorganizing. If a todo's answer is genuinely one word or "no" / "yes", write just that — don't pad it into a sentence to look complete.

## Metadata and language
Frontmatter (YAML/TOML) and all structural elements (headings, table columns, list nesting) are preserved intact. Output in the same language as the input; if a todo instruction is in a different language than the surrounding file, answer in the file's language, not the instruction's.

## Output
Up to three lists, in order:
1. Processed todos — one line each: what was resolved, or what blocking question was left open.
2. Reported todos — one line each, only if any: assistant + human markers left for joint work, with what was prepared.
3. Skipped todos — one line each, only if any were skipped due to the priority filter: marker location/text and its priority (e.g. "skipped (#pri 2): ...").

No other commentary.
