<script setup>
// Generic detail page for any content path without its own dedicated route
// (e.g. the divisions/geo/verticals boxes on the homepage) — same rendering
// pattern as index.vue, just driven by the current route instead of the locale root.
const route = useRoute()
const { toContentPath } = useContentRoute()
const { t } = useI18n()

const { data: page } = await useAsyncData(`slug-${route.path}`, () =>
  useContentQuery().where('path', '=', toContentPath(route.path)).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useSeoMeta({
  title: () => page.value?.title,
  description: () => [page.value?.description, page.value?.tags?.join(' · ')].filter(Boolean).join(' — ')
})

// "## Group\n- Date: text" sections (see verticals/001.realestate) render as a
// Timeline instead of plain bullet lists — everything else falls back to ContentRenderer as-is.
// Preamble is parsed+rendered via ContentRenderer (not bare MDC) so custom
// components (::country-badges etc.) and Prose overrides both resolve correctly.
const { data: timeline } = await useAsyncData(`slug-timeline-${route.path}`, async () => {
  const parsed = parseTimelinePage(page.value?.rawbody)
  if (!parsed) return null
  if (!parsed.preamble) return { ...parsed, preambleBody: null }
  const { parseMarkdown } = await import('@nuxtjs/mdc/runtime')
  const { body } = await parseMarkdown(parsed.preamble)
  return { ...parsed, preambleBody: body }
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <section class="space-y-3">
      <h1 class="text-3xl font-bold tracking-tight" style="color: var(--ui-text)">
        {{ page.title }}
      </h1>
      <p v-if="page.description" class="text-lg" style="color: var(--ui-text-muted)">
        {{ page.description }}
      </p>
      <p v-if="page.tags?.length" class="text-lg font-medium" style="color: var(--ui-text)">
        {{ page.tags.join(' · ') }}
      </p>
      <dl v-if="page.payin?.length || page.payout?.length" class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div v-for="key in ['payin', 'payout'].filter(k => page[k]?.length)" :key="key" class="flex flex-wrap items-center gap-1.5">
          <dt class="font-medium" style="color: var(--ui-text-muted)">{{ t(`content.${key}`) }}</dt>
          <dd v-for="rail in page[key]" :key="rail"><UBadge color="neutral" variant="subtle" size="sm">{{ rail }}</UBadge></dd>
        </div>
      </dl>
    </section>

    <AppSeparator />

    <template v-if="timeline">
      <ContentRenderer v-if="timeline.preambleBody" :value="{ body: timeline.preambleBody }" prose class="space-y-5" style="color: var(--ui-text-tinted)" />
      <PageTimeline :groups="timeline.groups" />
    </template>
    <ContentRenderer v-else :value="page" class="space-y-10" style="color: var(--ui-text-tinted)" />
  </div>
</template>
