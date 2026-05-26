<script setup>
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
      <AppSectionLabel :label="page?.title ?? 'Coin2Local'" />
      <div class="flex items-baseline gap-3 flex-wrap mt-1">
        <h1 class="text-2xl font-bold" style="color: var(--ui-text)">{{ page?.title }}</h1>
        <UBadge v-if="page?.badge" color="primary" variant="subtle" size="sm" class="shrink-0">{{ page.badge }}</UBadge>
      </div>
      <p v-if="page?.subtitle" class="text-lg mt-2" style="color: var(--ui-text-muted)">{{ page.subtitle }}</p>
    </div>

    <ServiceAnimation />

    <ContentRenderer v-if="page" :value="page" class="prose dark:prose-invert max-w-none" />
  </div>
</template>
