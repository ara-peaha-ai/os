<script setup>
const { t, locale } = useI18n()

const coinLocalParaguayPath = {
  en: '/en/services/coin-2-local/paraguay',
  es: '/es/servicios/coin-2-local/paraguay',
  pt: '/pt/servicos/coin-2-local/paraguai',
  nl: '/nl/diensten/coin-2-local/paraguay'
}

const [{ data: page }, { data: notes }] = await Promise.all([
  useAsyncData(`real-estate-in-paraguay-${locale.value}`, () =>
    queryCollection('content').where('path', '=', `/${locale.value}/real-estate`).first()
  ),
  useAsyncData(`coin-2-local-paraguay-${locale.value}`, () =>
    queryCollection('content').where('path', '=', coinLocalParaguayPath[locale.value] || coinLocalParaguayPath.en).first()
  )
])
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

    <SettlementSimulator country="PY" />

    <ContentRenderer v-if="notes" :value="notes" class="prose dark:prose-invert max-w-none" />

    <ContentRenderer :value="page" class="prose dark:prose-invert max-w-none" />
  </div>
</template>
