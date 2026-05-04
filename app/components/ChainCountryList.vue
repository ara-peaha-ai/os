<script setup>
const props = defineProps({
  codes: { type: Array, default: null },
  exclude: { type: Array, default: () => [] }
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

const allCountries = [
  { code: 'AR', active: false },
  { code: 'BO', active: false },
  { code: 'CL', active: false },
  { code: 'CR', active: false },
  { code: 'DO', active: false },
  { code: 'EC', active: false },
  { code: 'SV', active: false },
  { code: 'GT', active: false },
  { code: 'HN', active: false },
  { code: 'JM', active: false },
  { code: 'MX', active: false },
  { code: 'NI', active: false },
  { code: 'PA', active: true },
  { code: 'PY', active: true },
  { code: 'PE', active: false },
  { code: 'SR', active: false },
  { code: 'UY', active: false }
]

const visible = computed(() => {
  let list = allCountries
  if (props.codes) list = list.filter(c => props.codes.includes(c.code))
  else if (props.exclude.length) list = list.filter(c => !props.exclude.includes(c.code))
  return [...list].sort((a, b) =>
    t(`countries.${a.code}`).localeCompare(t(`countries.${b.code}`), locale.value)
  )
})

const routeFor = (code) => {
  if (code === 'PY') return localePath('services-coin-2-local-paraguay')
  if (code === 'PA') return localePath('services-coin-2-local-panama')
  return undefined
}

const linkFor = (c) => c.active ? routeFor(c.code) : undefined
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
    <NuxtLink
      v-for="c in visible"
      :key="c.code"
      :to="linkFor(c)"
      :class="[
        'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition',
        c.active
          ? 'border-primary hover:bg-primary/10 cursor-pointer'
          : 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed opacity-50'
      ]"
    >
      <span>{{ t(`countries.${c.code}`) }}</span>
      <UBadge v-if="!c.active" size="xs" color="neutral" variant="soft">soon</UBadge>
    </NuxtLink>
  </div>
</template>
