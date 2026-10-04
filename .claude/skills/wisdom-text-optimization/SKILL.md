---
name: wisdom-text-optimization
description: Reorganizes long text into tables or lists, compressing every concept into one row without dropping any, in a dry SEO style. Triggers: "reorg", "order in a table", "structure text", or equivalent phrasing in other languages. It can reduce the amount of text by removing duplicates but does NOT cut concepts. Output in the prevailing language of the provided data; if uncertain, ask for the desired output language in chat.
---
# Reorganize data without losing information

## Parameters

- No argument after the skill invocation → ask the user where to apply it.
- Plain text after the invocation (no path) → act on that text only, and return the output.
- A path after the invocation → apply the changes directly to the file(s) on disk, do not return the content in chat as a code block.
  - File → act on that file only.
  - Directory → act on all files inside it, modifying each one directly.
    - Markdown files (.md) are skipped; list all skipped files at the end of the response.
  - If the path doesn't exist or is empty (after skips), say so instead of doing nothing silently.

## Role
Compress the FORM, never the CONTENT. You are not a summarizer: you don't choose which concepts to keep — you keep all of them and shorten how they're expressed.

## Core rule
Every concept in the input becomes EXACTLY one row (heading, tag, or cell). Compress the form as much as possible while keeping every piece of evidence, data, number, and plan inside that row. Output rows = input concepts. Never merge two concepts into one row. Never spread one concept across multiple rows. A rambling 5-line passage becomes 1 line, without losing its details.

## Zero loss
No concept, data point, or nuance disappears. Exact numbers and names stay unchanged. When in doubt, include it.

## Minimal correction
Fix, with the smallest possible edit, obvious typos, Markdown syntax errors (broken links, missing pipes, wrong/duplicate list numbering), and elementary grammar mistakes found in the input. Don't touch style, wording, tone, or structure beyond what the correction requires. Never alter data, numbers, proper names, URLs, or technical terms even if they look unusual — they may be intentional.

## Format
Choose case by case: a table when concepts share comparable attributes, a list of tag-rows when they're a plain enumeration. Compression varies per concept: maximal (tag) for simple ones, a short phrase for ones that would lose meaning otherwise. No prose, no intro, no conclusion.

## Final check
Count the concepts extracted from the input and the rows in the output: they must match. If the output has fewer rows, concepts were lost — restore them before answering.

## Pattern: Insight articles (p2pay)

When producing or reorganizing an Insight article for the p2pay project, the opening section always follows this structure:

    ## [Article title]

    ### *[Subtitle — one sentence, italic]*

    *[Italic summary: 3–5 sentences. Covers the problem, who is impacted, key numeric data, main sections. Written as an abstract/teaser, not a narrative intro. Never spell out conclusions in full.]*

    References: [label](url) · [label](url) · ...

Rule: the summary must mention relevant numeric data (counts, estimates, percentages) and the article's main sections. It is not a summary of conclusions.

## Metadata and language

**Metadata**: When reorganizing a file with frontmatter (YAML, TOML, etc.), all original fields must be preserved intact. Do not add, remove, or modify any frontmatter field unless explicitly instructed.

**Language**: Produce output in the prevailing language of the original file or text received. If the input mixes languages or the target language is unclear, ask the user which language to use before producing output. Otherwise, don't switch language unless explicitly told to.

## Output: raw markdown

Write the file code in markdown syntax or when returned on terminal, output inside a ```markdown code block, so the text is ready to copy-paste as-is (no rendering/preview, raw syntax only).

In tables, use exactly one space before and after each pipe `|` — no extra spaces to visually align columns (no monospace-style padding). Same principle applies to lists and headings: no extra spacing for alignment, only the minimal necessary syntax.
