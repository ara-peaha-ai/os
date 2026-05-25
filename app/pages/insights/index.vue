<script setup>
const { locale } = useI18n()

const { data: insights } = await useAsyncData(`insights-index-${locale.value}`, async () => {
  const localized = await useContentQuery()
    .where('path', 'LIKE', `/${locale.value}/insights/%`)
    .order('date', 'DESC')
    .all()
  if (localized?.length) return localized
  return useContentQuery()
    .where('path', 'LIKE', `/en/insights/%`)
    .order('date', 'DESC')
    .all()
})

const pageTitle = computed(() => {
  const map = { nl: 'Inzichten', pt: 'Perspectivas', es: 'Perspectivas' }
  return map[locale.value] ?? 'Insights'
})

useSeoMeta({
  title: () => pageTitle.value,
  description: () => {
    const map = {
      nl: 'Technische analyses en inzichten over betalingsinfrastructuur.',
      pt: 'Análises técnicas e perspectivas sobre infraestrutura de pagamentos.',
      es: 'Análisis técnicos y perspectivas sobre infraestructura de pagos.'
    }
    return map[locale.value] ?? 'Technical analyses and insights on payment infrastructure.'
  }
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <h1 class="text-2xl font-bold" style="color: var(--ui-text)">{{ pageTitle }}</h1>

    <ul v-if="insights?.length" class="space-y-0">
      <li v-for="item in insights" :key="item.path" class="py-8" style="border-bottom: 1px solid var(--ui-border)">
        <NuxtLink :to="`/insights/${item.slug || item.path.split('/').pop()}`" class="group block space-y-2">
          <p class="text-xs font-medium uppercase tracking-wide" style="color: var(--ui-text-dimmed)">{{ item.title }}</p>
          <h2 v-if="item.subtitle" class="text-base font-semibold link-accent">{{ item.subtitle }}</h2>
          <h2 v-else class="text-base font-semibold link-accent">{{ item.title }}</h2>
          <div v-if="item.tags?.length" class="flex flex-wrap gap-2 pt-1">
            <span
              v-for="tag in item.tags.slice(0, 5)"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded"
              style="background-color: var(--ui-bg-elevated); color: var(--ui-text-muted); border: 1px solid var(--ui-border)"
            >{{ tag }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="text-sm" style="color: var(--ui-text-dimmed)">No insights published yet.</p>
  </div>
</template>
