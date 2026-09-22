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

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: { include: '**/*.md' },
      schema: z.object({
        rawbody: z.string().optional(),
        draft: z.boolean().optional(),
        date: z.string().optional(),
        tags: z.array(z.string()).optional(),
        subtitle: z.string().optional(),
        intro: z.string().optional(),
        badge: z.string().optional(),
        hero: z.object({
          label: z.string(),
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
        verticals: homeSection.optional()
      })
    })
  }
})
