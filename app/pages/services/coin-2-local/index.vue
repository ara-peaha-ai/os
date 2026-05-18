<script setup>
const { t } = useI18n()
const route = useRoute()

const { data: page } = await useAsyncData(`coin-2-local-${route.path}`, () =>
  useContentQuery().where('path', 'LIKE', `%${route.path}`).first()
)
useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-8">
    <div>
      <div class="flex items-center gap-3">
        <p class="text-sm uppercase tracking-wide text-gray-500">{{ t('services.chain2fiat') }}</p>
        <UBadge v-if="page?.badge" color="primary" variant="subtle" size="sm">{{ page.badge }}</UBadge>
      </div>
      <h1 class="text-2xl font-bold mt-1">{{ page?.title ?? 'Coin2Local' }}</h1>
      <p v-if="page?.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">{{ page.subtitle }}</p>
      <p v-if="page?.intro" class="text-base text-gray-600 dark:text-gray-300 mt-3">{{ page.intro }}</p>
    </div>

    <ServiceAnimation />

    <ContentRenderer v-if="page" :value="page" class="prose dark:prose-invert max-w-none" />
  </div>
</template>
