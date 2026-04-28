import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      // include everything; keeps your /en/... /ar/... paths from folders
      source: { include: '**/*.md' },
      // "magical" field that ships raw markdown into the DB output
      schema: z.object({
        rawbody: z.string().optional()
      })
    })
  }
})
