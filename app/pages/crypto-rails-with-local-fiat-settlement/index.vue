<script setup>
const { locale } = useI18n()
const route = useRoute()

const { data: pageContent } = await useAsyncData('landing-content', () =>
  queryCollection('content').path(`/${locale.value}${route.path}`).first()
)

const countries = [
  { code: 'PY', name: 'Paraguay', active: true },
  { code: 'AR', name: 'Argentina', active: false },
  { code: 'BO', name: 'Bolivia', active: false },
  { code: 'CL', name: 'Chile', active: false },
  { code: 'CR', name: 'Costa Rica', active: false },
  { code: 'DO', name: 'República Dominicana', active: false },
  { code: 'EC', name: 'Ecuador', active: false },
  { code: 'SV', name: 'El Salvador', active: false },
  { code: 'GT', name: 'Guatemala', active: false },
  { code: 'HN', name: 'Honduras', active: false },
  { code: 'JM', name: 'Jamaica', active: false },
  { code: 'MX', name: 'México', active: false },
  { code: 'NI', name: 'Nicaragua', active: false },
  { code: 'PA', name: 'Panamá', active: false },
  { code: 'PE', name: 'Perú', active: false },
  { code: 'SR', name: 'Suriname', active: false },
  { code: 'UY', name: 'Uruguay', active: false }
]
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-8">
    <ContentRenderer v-if="pageContent" :value="pageContent" class="prose dark:prose-invert max-w-none" />

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <NuxtLinkLocale
        v-for="c in countries"
        :key="c.code"
        :to="c.active ? `${route.path}/paraguay` : undefined"
        :class="[
          'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition',
          c.active
            ? 'border-primary hover:bg-primary/10 cursor-pointer'
            : 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed opacity-50'
        ]"
      >
        <span>{{ c.name }}</span>
        <UBadge v-if="!c.active" size="xs" color="neutral" variant="soft">
          soon
        </UBadge>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
