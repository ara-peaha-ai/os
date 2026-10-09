import { resolve } from 'node:path'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const externalLink = z.object({
  label: z.string(),
  url: z.string()
})

const sectionItem = z.object({
  slug: z.string().optional(),
  label: z.string(),
  name: z.string(),
  description: z.string(),
  linkText: z.string().optional(),
  eta: z.string().optional(),
  externalLinks: z.array(externalLink).optional()
})

const homeSection = z.object({
  anchor: z.string().optional(),
  label: z.string(),
  h2: z.string(),
  intro: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  items: z.array(sectionItem)
})

const pageSchema = z.object({
  rawbody: z.string().optional(),
  draft: z.boolean().optional(),
  // visibility: public only with share AND public true; missing = false (true in *.pub.md)
  share: z.boolean().optional(),
  public: z.boolean().optional(),
  // aliases read as share/public, written back as the canonical key; `publish` = legacy share
  shared: z.boolean().optional(),
  published: z.boolean().optional(),
  publish: z.boolean().optional(),
  // planning (tag-syntax): file feeds the Gantt view; est/act = file-level budget and actuals, e.g. "7d 2000USD"
  gantt: z.boolean().optional(),
  est: z.string().optional(),
  act: z.string().optional(),
  // canonical source of truth; slaves = languages (IT) or paths (/01.business) it propagates to
  master: z.boolean().optional(),
  slaves: z.union([z.string(), z.array(z.string())]).optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  subtitle: z.string().optional(),
  intro: z.string().optional(),
  // one badge, or several (e.g. divisions: ["Veterans", "MIT/Prop"])
  badge: z.union([z.string(), z.array(z.string())]).optional(),
  // small corner mark on content boxes: legal entity or license behind the item (e.g. MIT, EAS, LLC)
  entity: z.string().optional(),
  // where the entity mark links: a content path under the locale (entities/eas) or an absolute URL
  entityLink: z.string().optional(),
  disable: z.boolean().optional(),
  code: z.string().optional(),
  // payment rails of a use case or vertical, shown under the title on its page
  payin: z.array(z.string()).optional(),
  payout: z.array(z.string()).optional(),
  status: z.union([z.boolean(), z.string()]).optional(),
  // frontmatter-driven homepage sections (content/*/index.md)
  hero: z.object({
    label: z.string().optional(),
    h1: z.string(),
    tagline: z.string().optional(),
    subtitle: z.string().optional(),
    paragraphs: z.array(z.string())
  }).optional(),
  products: homeSection.optional(),
  advisory: homeSection.optional(),
  thesis: z.object({
    label: z.string(),
    h2: z.string(),
    paragraphs: z.array(z.string()),
    cta: z.string(),
    ctaSlug: z.string()
  }).optional(),
  verticals: homeSection.optional(),
  // homepage only: navbar groups, each a folder (string) or a custom list of paths (array) — see useNav
  nav: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional()
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
