---
name: collab-framework
description: "The Peaha human+AI collaboration framework — the product we build by using it on ourselves. Defines where durable knowledge is persisted (skills, never the memory dir), where skills and content live, and the team conventions that go with it, starting with the #todo responsible-tagging standard. Use when deciding where to record a convention/decision/project fact, or when writing #todo markers in doc content."
---

# Peaha collaboration framework

We are building a human+AI collaboration framework that Peaha will sell. It is
built and validated by dogfooding: every rule here is one we actually run on
ourselves first. When a working practice proves out, it gets written down **here
or in another skill** so it ships with the framework.

## Persistence rule: skills, not memory

Do **not** write project facts, decisions, or conventions into the Claude Code
memory dir (`~/.claude/projects/**/memory/`). That content does not travel with
the framework.

- **Durable knowledge → a skill.** A reusable convention, workflow, or standard
  goes in this skill or a new dedicated one in `wisdom/.claude/skills/`.
- **Project-specific facts → the repo.** Architecture, decisions, and status go in
  the project's own docs (e.g. `content/original/doc/**` in the content repo),
  not memory.
- **Memory holds one line only:** `non salvo niente in memoria salvo tutto nelle skill`.

## Write down what the owner states

Every decision, convention, or direction the project owner states in chat goes
into skills and docs, in synthetic form, in the same turn.

## Same setup on every machine

Every convention and agent setting the team relies on lives in the project (the
framework skills, repo files), never in a personal `~/.claude/CLAUDE.md` or
`settings.json`. A VPS or any new machine installed from the repos behaves
exactly like a team member's PC.

## Where skills and content live

| What | Where | Why |
|---|---|---|
| Framework skills (this one, `tag-syntax`, `frontmatter`, `wisdom-ai-todos`, ...) | `wisdom/.claude/skills/<name>/SKILL.md`, committed | They hold no user data; public, MIT |
| Third-party skills | `wisdom/.agents/skills/`, registry-managed (`skills-lock.json`), symlinked into `.claude/skills/` | Pinned by hash |
| User content (docs, web pages, team) | the private content repo, fetched at build time (gitignored) or written and deleted after the build | The cloud version must not keep every user's data on the build machine |
| Personal cross-project skills | `~/.claude/skills/` on that person's machine | Not part of the framework |

- A custom skill is a folder `<name>/SKILL.md` with `name:` and `description:`
  frontmatter, never a flat `.md` file.
- Skills never contain team names, personal paths, or private doc content:
  anything private stays in the content repo and the skill points to it.
- Agents need skills at session time, not only at build time, so skills never
  depend on the per-build content fetch.
- Claude Code loads skills only from `~/.claude/skills` and `<repo>/.claude/skills`.
  `wisdom/scripts/link-skills.sh` links every framework skill into
  `~/.claude/skills`, so sessions in any repo (orchestrator, the content repo, ...)
  load them. Run it after cloning wisdom on a new machine and after adding a skill.

## Repo roles

- `wisdom` — the engine: app, rendering, framework skills, and every script
  (checks, sync, Gantt).
- Content repo (`sovereign`) — remote of static content only: `.md` and other
  files, public and private. Access to the private GitHub repo = access to
  everything in it; `share`/`public` are publishing flags, not access control.
- Content tree: arbitrary nesting depth, folders are part of the structure. How
  it renders (website, docs, other) is decided later by the owner.

## Two flows, one repo

- Every UI action = one repo operation. Coder flow ("nerds") edits the repo
  directly; UI flow ("normies") does the same through the dashboard.
- New file: coder flow = VS Code snippet; UI flow = pick one of 4–5 prefilled
  templates.
- Dashboard drag & drop of an element = moving the component that reads its data
  from the `.md` files. Priority: lowest.
- Layout: Nuxt UI (`UPageGrid`, `UPageColumns`, `UDashboardGroup` + resizable
  panels, Tailwind grid) — no Bulma. Drag & drop is not in Nuxt UI (only
  `UEditorDragHandle` for editor blocks): add it at that stage.

## `#todo` responsible-tagging

Every unresolved decision or open item left in doc content gets a `#todo` marker
naming who owns it, in place of free-text like `(decision pending)` or a bare
`#todo`. Marker grammar (`#todo` / `#pri` / `#master`, inline vs frontmatter,
resolution) lives in the `tag-syntax` skill. This skill defines **which human**.

The responsible human is deduced from the team roles in the content repo's
`content/original/doc/000.team/` frontmatter. Handles are the person's first
name, lowercase, matching those filenames (`000.team/001.<name>.pri.md` →
`@<name>`) — not the GitHub handle.

| Domain of the open item | Role |
| - | - |
| Technology, product build, security | CTO / CISO |
| Sales, marketing, finance | CSO / CMO / CFO |
| Strategy, operations, compliance, legal | CEO / COO / CCO |
| Long-term vision, direction | CVO |
| AI-executable task | CAIO (`@claude`) |

**Onboarding override:** while the CTO is being onboarded, technical items tag
both the CEO and the CTO plus the assistant. Per `tag-syntax`, an
assistant+human marker is worked jointly, when the human decides to start — the
assistant does not auto-resolve it.

## Attribution and credits

No AI attribution anywhere: no "🤖 Generated with Claude Code" in PR
descriptions, no `Co-Authored-By: Claude` trailer in commits, no similar footer
in issues or comments. Credits are assigned separately, by a dedicated system
tied to payment.

## Ponytail overrides

The ponytail plugin (lazy-senior-dev coding mode) is active by default on every
machine. Its rules apply except where they conflict with these:

- **Plan first, not code first**: for non-trivial tasks, a brief plan comes
  before the code. After the code, explain what is needed to review it; the
  3-line cap does not apply.
- **Ask, don't default, on real ambiguity**: "ship the lazy version and question
  it" applies only to low-stakes choices. Ambiguous requirements get a question.
- **Scaffolding for planned work is allowed**: when work is explicitly planned
  across sessions (roadmap, epic, `#todo`, or stated by the owner), set up the
  structure it needs now, each placeholder marked with a `#todo` naming what
  fills it and when. Speculative "maybe later" scaffolding is still banned.

## Currency

All monetary figures in doc content are **USD** unless a line explicitly states
otherwise. Providers that quote in EUR (e.g. Contabo) get converted; where the provider also
publishes a USD price, use that USD price directly. Do not leave `€` figures in
the docs.

## Renaming and moving files

- Git stores no rename: it detects one at commit time when the deletion and the new file land **in the same commit** and the content is mostly unchanged (>50% similar). `git log --follow <file>` then shows the full history.
- `git mv old new` = move + stage both sides at once, so the rename can't be split by accident. Agents always use it.
- Renaming in VS Code works too: the old path shows `D` (deleted), the new one green `U` (untracked). History is kept if both are staged and committed together (`git add -A <folder>` or stage both in Source Control). Committing only the new file leaves the old one in the repo.
- Rename in one commit, edit content in the next: a big content change in the same commit can break the similarity detection.
- After a rename, links and references to the old path (relative links, skills and docs naming the file) are updated in the same commit.
- A PR that renames or moves files merges with **Rebase and merge** (or a merge commit), never Squash: squash folds the renames-only commit into the content commit, and files whose content changed a lot lose rename detection on `main`.

## One clone per repo

- Each machine has one workspace directory holding one canonical working copy per repo (`<workspace>/wisdom`, `<workspace>/sovereign`, `<workspace>/orchestrator`, ...). Work happens there, on a task branch. Never create another clone of a repo that already has one there.
- Parallel sessions on the same repo use `git worktree add <path> -b <branch> origin/main` from the canonical copy: same history and branches, nothing to sync. Remove it with `git worktree remove <path>` once the branch is merged or pushed. A worktree is one-shot, never a second home for the repo.
- Found an extra clone or worktree at session start? Use the canonical copy and tell the owner about the extra one; never pick a copy by guessing.
- Before removing any clone or worktree: every branch and commit in it is on GitHub (`git log --branches --not --remotes` empty) and the working tree is clean. A bundle in `~` is not a backup: push the branches instead.

## Open items

Open items on this framework carry team handles, so they live in the content repo
(`content/original/doc/002.development/011.ai/`), not here.
