<script setup>
const route = useRoute()
const { locale } = useI18n()

const { data: page } = await useAsyncData(`insight-${route.path}-${locale.value}`, () =>
  useContentQuery().where('path', 'LIKE', `%${route.path}`).first()
)
useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div v-if="page" class="max-w-3xl mx-auto p-6 space-y-10">
    <div>
      <p class="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">Insight</p>
      <h1 class="text-2xl font-bold mt-1">{{ page.title }}</h1>
      <p v-if="page.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">{{ page.subtitle }}</p>
    </div>
    <ContentRenderer :value="page" class="prose dark:prose-invert max-w-none" />
  </div>
  <div v-else class="max-w-3xl mx-auto p-6">
    <p class="text-gray-400">Coming soon.</p>
  </div>
</template>
