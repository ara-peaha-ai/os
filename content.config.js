import { resolve } from 'node:path'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const pageSchema = z.object({
  rawbody: z.string().optional(),
  draft: z.boolean().optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  subtitle: z.string().optional(),
  intro: z.string().optional(),
  badge: z.string().optional(),
  disable: z.boolean().optional(),
  code: z.string().optional(),
  status: z.union([z.boolean(), z.string()]).optional()
})

// ponytail: opt-in only (NUXT_ENABLE_SOVEREIGN_PREVIEW=true) so a plain `npm run dev`
// never depends on the sibling checkout existing. See `npm run dev:sovereign-preview`.
// Reads straight off disk from the sovereign repo checked out alongside wisdom
// (no git fetch, no token, no push needed — just the local working tree), merged
// into the same `content` collection under the dev-only `original` locale prefix
// so it renders through the real pages (index.vue, layout, ServiceAnimation) as-is.
const sources = [{ include: '**/*.md' }]
if (process.env.NUXT_ENABLE_SOVEREIGN_PREVIEW === 'true') {
  sources.push({
    // must be absolute: Nuxt Content's dev-mode file watcher compares this against
    // resolved (absolute) file-change paths, so a relative cwd silently breaks hot-reload
    // (edits only show up after a full server restart) — resolve() is the fix.
    cwd: resolve(process.env.NUXT_SOVEREIGN_CONTENT_DIR || '../sovereign'),
    include: 'content/original/web/**/*.md',
    prefix: '/original'
  })
}

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: sources,
      schema: pageSchema
    })
  }
})
