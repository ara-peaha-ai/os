---
name: tag-syntax
description: "Inline/frontmatter marker grammar used across Peaha doc content — ##todo (actor-addressed instructions), #pri (priority), !<when> (due date / scheduled time, or a short/mid/long horizon), #master (canonical naming/language source of truth with scoped propagation), #est/#act (estimated/actual time and money with roll-up), gantt (frontmatter, Gantt view). Use when writing, reading, or resolving these markers in content/original/doc/** or any project doc."
---

# Tag syntax

Markers used in Peaha doc content. Each tag works **inline** (same line or table cell
as what it applies to) or as a **YAML frontmatter key** — same tag, either form.
Commands (`##<name> … <name>##`) live in the body only: inside a frontmatter value
they are plain text, nothing parses them.

Companion skills: `wisdom-ai-todos` (executes the markers),
`collab-framework` (who the responsible human is, by team role).

## `##<command>` vs `#<tag>`

A double hash opens a **command**: something an actor has to act on. `##todo` is
the only command today; `##note`, `##event` and any future `##<name>` stay plain
text until they get a closer and a component. A single hash is a plain **tag** (`#pri`,
`#master`, `#est`, or any free tag) that only labels. `#todo` is a plain tag,
never the todo command.

A command always closes with its own name: `##todo … todo##`, `##note … note##`.
Flags (`@handle…`, `#pri N`, `!<when>`) go right after the opener by convention,
but are read anywhere inside the command; in a multi-paragraph command, only on its
opening line: `##todo @giovanni @claude #pri 1 !2026-10-20 decide the LN custody model todo##`.
A `##todo` without its `todo##` is not a command: it renders as text and no agent runs it.
It works inside a sentence or table cell, or across paragraphs when the opener
starts one paragraph and the closer ends a later one. Inside inline code it is
an example, not a command.

On the site, `remark-commands.mjs` (wisdom) turns each command into the content
component of the same name (`Todo.vue`), flags as props: `to`, `pri`, `when`.
`::todo-list` lists the page's todos (`::todo-list{path="<folder>"}` for a whole
folder), most urgent first.

## `##todo @<handle...> <instruction>`

An instruction addressed to one or more actors. A marker may carry several
handles — assistant and human together is allowed and meaningful.

Who acts, by the mix of handles:

- **Assistant only** (`@ai` / `@claude`, no human handle) — the assistant's to do.
  On the next resolve run (a human telling the assistant to resolve its todos),
  the assistant performs the task and replaces the whole marker with the outcome,
  written to fit the surrounding text.
- **Assistant + human** (`@claude @<human>`, `@<human> @<human> @claude`, ...) —
  done jointly, and only when the human decides to start. The assistant does
  **not** finalize it on a resolve run; it may research and prepare, but the
  marker stays until the human drives it to resolution together with the assistant.
- **Human only** (`@<human>`, ...) — not the assistant's concern. Left
  byte-for-byte untouched by the resolve skill.

When something addressed to the assistant genuinely can't be done — needs a
decision only a human can make, needs inaccessible information, or is truly
ambiguous — the marker stays, its instruction rewritten into a precise blocking
question. Never fabricate.

Handles are the person's first name, lowercase, matching the filenames in
`content/original/doc/000.team/` of the content repo. Which human owns an open
item is derived from team roles — see `collab-framework`.

## `#pri N`

Priority. Lower `N` = more urgent. A bare integer after `!` (`!1`, `!2`) is the
old inline form — deprecated, write `#pri N`.

## `!<when>` — due date / scheduled time

`<when>` is an ISO date (`!2026-09-11`), optionally with time and timezone
(`!2026-09-11 14:00:py`), or a relative token (`!today`, `!tomorrow`, `!monday`).
On a `##todo` line, `<when>` can also be a planning horizon: `!short`, `!mid`,
`!long` (short, mid, long term). A horizon is a bucket, not a deadline: the item
stays in the backlog, not on the timeline, and a horizon is not valid on
`##event` lines or as a Gantt start date. Each horizon's end date rolls forward
when the current short term closes; the current end dates are team data and live
in the content repo, not in this skill.
One item carries one `!<when>`: on `##event` lines it is the event time, on
`##todo` lines the deadline. Priority (`#pri N`) and due date (`!<when>`) are
separate axes — an item can have both.

## `#master` — canonical source of truth

`#master` (bare) or `#master true` on a line, file, or repo name means: whatever
it says overrides every other copy of the same thing, and the change is
propagated to that thing's "slaves". Two cases:

- **Naming** — on a repo name or heading (e.g. `# peaha/pay #master true #pri 1`):
  that name is the real one. Rename every other repo, file, README, remote, and
  doc reference still carrying the old name to match.
- **Language** — the file carrying `#master` (or, with no explicit tag, whichever
  file the user wrote or co-wrote directly with the assistant, in the language
  they chose) is the source-of-truth language version. Every other-language file
  is a slave translation: regenerate or expand it from the master whenever the
  master changes; never edit a slave independently.

### Scope (which slaves)

- **Unscoped** (`#master` / `#master true`, nothing after) — propagates
  everywhere: every repo for a naming master, every language for a language master.
- **Inline path** after the tag — scopes a naming master to that folder/subtree
  only: `#master /01.business` renames only within `/01.business`.
- **Inline language code** (or comma list) after the tag — scopes a language
  master to those languages: `#master IT`, `#master IT,EN`.
- **Frontmatter** — `master: true` plus a separate `slaves:` key: `slaves: IT` or
  `slaves: [IT, EN]` (language), `slaves: /01.business` or
  `slaves: [/01.business, /02.development]` (naming). No `slaves:` key = unscoped.

## `#est <qty...>` / `#act <qty...>` — estimated / actual resources

On a heading. A quantity is a number plus a unit; several per tag, space-separated:
`## Spike #est 2h 150USD #act 3h`.

- **Time units**: `h`, `d`, `w`, `mo`, `y`. Fixed conversion: `1d = 8h`, `1w = 5d`,
  `1mo = 21d`, `1y = 12mo`.
- **Money units**: ISO 4217 code uppercase (`USD`, `PYG`, `BRL`, `EUR`), plus `BTC`
  and `sat`. Sums are per currency, never converted.
- **Roll-up**: `#est` on a parent heading is its budget; the sum of its children's
  `#est` is the planned amount. Budget minus planned shows as unallocated when
  positive, as overrun when negative. A heading without `#est` takes the sum of its
  children. Same rules for `#act`.
- **Frontmatter**: `est:` / `act:` carry the file-level budget and actuals
  (`est: 7d 2000USD`).

## `gantt: true` — Gantt view (frontmatter)

The file feeds the Gantt view. Headings with `#est` become bars; `!<when>` on a
heading is its start date; `#after <id>` makes it start when heading `<id>` ends;
`{#id}` after the heading text gives it a stable id (assigned automatically on first
sync when missing). Edits made in the Gantt view wait as pending state and are
written back to the `.md` on sync, as one signed commit.

## Resolution

- The resolve skill (`wisdom-ai-todos`) acts on **assistant-only** `##todo`
  markers, reports **assistant+human** markers without resolving them, and leaves
  **human-only** markers untouched. `#master` propagation is not part of it yet:
  it runs only when a human asks for it explicitly.

## Style

- Write what something **is**, not what it is not — unless explicitly asked otherwise.

## Open items

Open items on this skill carry team handles, so they live in the content repo
(`content/original/doc/002.development/011.ai/`), not here.
