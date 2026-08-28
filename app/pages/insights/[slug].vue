<script setup>
const route = useRoute()
const { locale } = useI18n()

const { data: page } = await useAsyncData(`insight-${route.path}-${locale.value}`, async () => {
  if (locale.value !== 'int') {
    const localePage = await useContentQuery()
      .where('path', '=', `/${locale.value}${route.path}`)
      .first()
    if (localePage) return localePage
  }
  return useContentQuery().where('path', 'LIKE', `%${route.path}`).first()
})
useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})

const readingTime = computed(() => {
  if (!page.value?.rawbody) return null
  const words = page.value.rawbody.trim().split(/\s+/).length
  return Math.ceil(words / 200)
})
</script>

<template>
  <div v-if="page" class="max-w-3xl mx-auto p-6">
    <div class="mb-10">
      <AppSectionLabel label="Insight" />
      <h1 class="text-2xl font-bold mt-1" style="color: var(--ui-text)">{{ page.title }}</h1>
      <p v-if="page.subtitle" class="text-base font-medium mt-1" style="color: var(--ui-text-muted)">{{ page.subtitle }}</p>
      <p v-if="readingTime" class="text-sm mt-2" style="color: var(--ui-text-dimmed)">{{ readingTime }} min read</p>
    </div>
    <ContentRenderer :value="page" class="prose dark:prose-invert max-w-none" />
  </div>
  <div v-else class="max-w-3xl mx-auto p-6">
    <p class="text-sm" style="color: var(--ui-text-dimmed)">Coming soon.</p>
  </div>
</template>
