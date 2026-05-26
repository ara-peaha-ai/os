<script setup>
const route = useRoute()

const { data: page } = await useAsyncData(`coin-2-local-real-estate-panama-${route.path}`, () =>
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
      <AppSectionLabel label="Coin2Local" />
      <h1 class="text-2xl font-bold mt-1">{{ page.title }}</h1>
      <p v-if="page.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">{{ page.subtitle }}</p>
      <p v-if="page.intro" class="text-base text-gray-600 dark:text-gray-300 mt-3">{{ page.intro }}</p>
    </div>
    <ContentRenderer :value="page" class="prose dark:prose-invert max-w-none" />
  </div>
</template>
