// Runnable check for remark-commands.mjs: `node remark-commands.check.mjs`
import assert from 'node:assert/strict'
import { unified } from 'unified'
import parse from 'remark-parse'
import mdc from 'remark-mdc'
import toHast from 'remark-rehype'
import { toHtml } from 'hast-util-to-html'
import commands from './remark-commands.mjs'

const pipeline = unified().use(parse).use(mdc).use(commands).use(toHast)
const render = async md => toHtml(await pipeline.run(pipeline.parse(md)))

// `::todo` block: flags from the first line become props, the text loses them
const block = await render('::todo\n@ai @giovanni #pri 1 !2026-10-20 write the spec\n::\n')
assert.match(block, /<todo[^>]*to="ai giovanni"/)
assert.match(block, /<todo[^>]*pri="1"/)
assert.match(block, /<todo[^>]*when="2026-10-20"/)
assert.match(block, /<todo[^>]*block/)
assert.match(block, /<p>write the spec<\/p>/)

// nested, official MDC order: inner block has more colons
const nested = await render('::list\n  :::todo\n  @ai nested one\n  :::\n::\n')
assert.match(nested, /<list>[\s\S]*<todo[^>]*to="ai"[\s\S]*nested one/)

// inline `##todo … todo##` still works
const inline = await render('Text ##todo @ai fix it todo## after.\n')
assert.match(inline, /Text <todo to="ai">fix it<\/todo> after\./)

// other components are untouched
assert.doesNotMatch(await render('::note\n@ai text\n::\n'), /to="ai"/)

console.log('remark-commands: ok')
