<script setup>
const props = defineProps({
  content: Object
})

const route = useRoute()
const { t } = useI18n()

useHead(() => ({
  title: props.content?.title
}))

const showAnimation = computed(() => {
  const animated = ['fiat-2-chain', 'chain-2-fiat', 'local-2-coin', 'coin-2-local', 'latam-2-int', 'int-2-latam']
  return animated.some(s => route.path.includes(s))
})

const showCountries = computed(() =>
  route.path.includes('chain-2-fiat') || route.path.includes('coin-2-local')
)
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <div v-if="content">
      <div class="flex items-baseline gap-3 flex-wrap">
        <h1 class="text-2xl font-bold">{{ content.title }}</h1>
        <UBadge v-if="content.badge" color="primary" variant="subtle" size="sm" class="shrink-0">{{ content.badge }}</UBadge>
      </div>
      <p v-if="content.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">
        {{ content.subtitle }}
      </p>
    </div>

    <ServiceAnimation v-if="showAnimation" />

    <ContentRenderer v-if="content" :value="content" class="prose dark:prose-invert max-w-none" />

    <div v-if="showCountries" class="rounded-xl border border-dashed border-primary/60 p-5 space-y-3">
      <div class="flex items-center gap-2">
        <UBadge color="primary" variant="soft" size="sm">{{ t('coin2property.badge') }}</UBadge>
        <span class="text-xs text-gray-400">{{ t('coin2property.timeline') }}</span>
      </div>
      <div>
        <p class="text-xs font-mono text-primary/70 mb-1">{{ t('coin2property.brand') }}</p>
        <h3 class="text-lg font-bold">{{ t('coin2property.title') }}</h3>
        <div class="flex gap-4 mt-2">
          <div>
            <p class="text-xl font-bold text-primary">{{ t('coin2property.fee') }}</p>
            <p class="text-xs text-gray-400 uppercase tracking-wide">{{ t('coin2property.feeLabel') }}</p>
          </div>
          <div class="border-l border-gray-200 dark:border-gray-700 pl-4">
            <p class="text-xl font-bold text-primary">{{ t('coin2property.limit') }}</p>
            <p class="text-xs text-gray-400 uppercase tracking-wide">{{ t('coin2property.limitLabel') }}</p>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ t('coin2property.description') }}</p>
      </div>
      <NuxtLinkLocale to="/contact" class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        {{ t('coin2property.cta') }} →
      </NuxtLinkLocale>
    </div>

  </div>
</template>
