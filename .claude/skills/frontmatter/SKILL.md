---
name: frontmatter
description: "Frontmatter standard for Peaha content files: required keys and defaults per file type (doc/web content, skills, memory), visibility flags share/public with their aliases, and the legacy public/publish mapping. Use when creating any .md file in the content repo or wisdom content, a skill, or a memory file, or when reading visibility flags."
---

# Frontmatter standard

## Content files (doc, web)

Every new file starts with:

```yaml
---
title: <name>
description: <one sentence>
share: false
public: false
---
```

In VS Code: snippet `fm` from the content repo's `.vscode/frontmatter.code-snippets`,
or "Snippets: Fill File with Snippet" on an empty `.md`.

Other keys (`gantt`, `est`, `act`, `master`, `slaves`, ...) follow, see `tag-syntax`.

## One block only

One frontmatter per file, at the top. No YAML blocks in the body: metadata of an
embedded object goes on one line, e.g. **Skill** `name` — description.

## Visibility flags

| Key | Alias | Meaning when `true` |
|---|---|---|
| `share` | `shared` | meant to be shared |
| `public` | `published` | ready, goes public |

- Missing key = `false`, except in `.pub.md` files: there a missing or non-contradicting key = `true` (`share: true`, `public: true`).
- Parsers accept the alias and write the canonical key.
- Content is public only with `share: true` + `public: true`.

## Suffix and legacy keys

- Private is the conservative default. Mismatch = no suffix, or suffix vs
  frontmatter contrast.
- The content repo's `scripts/check-visibility.mjs` lists all mismatches at once
  in one question (numbers to publish); 30 s without answer = all private (rename
  to `.pri.md`, flags `false`). `--fix` = all private without asking. An agent
  without a terminal asks the same single question in chat.
- Legacy key: old `publish` = `share`, read as such by the script. `public` is unchanged.

## Content tree

- Folders nest as deep as needed (Nuxt Content logic): `folder/index.md` is the folder's own page, other files are its children.
- Order prefix: digits only (`001.`, `01.`, `1.`), 3 digits standard, only where order matters; never in the slug. No letter prefixes (`00A.`): they stay in the slug.
- Slug: `x.pub.md` → `x`, `x.pri.md` → `x-pri`. Valid: pub only, pri only, or both. Plain `.md` = mismatch.
- `<!--more-->` = excerpt/preview split only, never a visibility boundary.
- Body: h1 = frontmatter `title`, sections h2 → h6 without skipping levels.
- No number emoji (`1️⃣`) in headings or lists: a real sequence gets plain numbers (`1.` before the heading text at the level its parent requires, `1.` list items), anything else no number.

## Other file types

| Type | Required keys |
|---|---|
| Skill (`SKILL.md`) | `name`, `description` |
| Claude memory file | `name`, `description`, `metadata.type` |

Skills and memory files carry no visibility flags.
