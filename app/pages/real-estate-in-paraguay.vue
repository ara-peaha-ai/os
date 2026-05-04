<script setup>
const { t, locale } = useI18n()

const { data: page } = await useAsyncData(`real-estate-in-paraguay-${locale.value}`, () =>
  queryCollection('content').where('path', '=', `/${locale.value}/real-estate`).first()
)
useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div v-if="page" class="max-w-3xl mx-auto p-6 space-y-10">
    <div>
      <p class="text-sm uppercase tracking-wide text-gray-500">{{ t('blockchainToFiat.paraguayTitle') }}</p>
      <div class="flex items-baseline gap-3 flex-wrap mt-1">
        <h1 class="text-2xl font-bold">{{ page.title }}</h1>
        <UBadge v-if="page.badge" color="primary" variant="subtle" size="sm" class="shrink-0">{{ page.badge }}</UBadge>
      </div>
      <p v-if="page.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">{{ page.subtitle }}</p>
      <p v-if="page.intro" class="text-base text-gray-600 dark:text-gray-300 mt-3">{{ page.intro }}</p>
    </div>

    <SettlementSimulator
      endpoint="/api/settlement/quote"
      :example-amounts="{ minimal: 1000, standard: 5000, enhanced: 50000 }"
      :local-currency="{ code: 'PYG', symbol: '₲', locale: 'es-PY' }"
    />

    <ContentRenderer :value="page" class="prose dark:prose-invert max-w-none" />
  </div>
</template>
