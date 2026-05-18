<script setup>
const { locale } = useI18n()

const { data: insights } = await useAsyncData(`insights-index-${locale.value}`, () =>
  useContentQuery()
    .where('path', 'LIKE', `/${locale.value}/insights/%`)
    .order('date', 'DESC')
    .all()
)

useSeoMeta({
  title: () => locale.value === 'nl' ? 'Inzichten' : locale.value === 'pt' ? 'Perspectivas' : locale.value === 'es' ? 'Perspectivas' : 'Insights',
  description: () => locale.value === 'nl' ? 'Technische analyses en inzichten over betalingsinfrastructuur.' : locale.value === 'pt' ? 'Análises técnicas e perspectivas sobre infraestrutura de pagamentos.' : locale.value === 'es' ? 'Análisis técnicos y perspectivas sobre infraestructura de pagos.' : 'Technical analyses and insights on payment infrastructure.'
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <h1 class="text-2xl font-bold">
      {{ locale === 'nl' ? 'Inzichten' : locale === 'pt' || locale === 'es' ? 'Perspectivas' : 'Insights' }}
    </h1>

    <ul v-if="insights?.length" class="space-y-8">
      <li v-for="item in insights" :key="item.path" class="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0">
        <NuxtLink :to="`/insights/${item.slug || item.path.split('/').pop()}`" class="group block space-y-2">
          <h2 class="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
            {{ item.title }}
          </h2>
          <p v-if="item.description" class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</p>
          <div v-if="item.tags?.length" class="flex flex-wrap gap-2 pt-1">
            <span
              v-for="tag in item.tags.slice(0, 5)"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >{{ tag }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="text-gray-400 text-sm">No insights published yet.</p>
  </div>
</template>
