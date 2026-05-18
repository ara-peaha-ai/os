<script setup>
const props = defineProps({
  codes: { type: Array, default: null },
  exclude: { type: Array, default: () => [] },
  service: { type: String, default: 'coin-2-local' }
})

const { t, locale } = useI18n()
const NuxtLink = resolveComponent('NuxtLink')
const localePath = useLocalePath()

const allCountries = [
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

const serviceRoutes = {
  'coin-2-local': {
    PY: 'services-coin-2-local-real-estate-paraguay',
    PA: 'services-coin-2-local-real-estate-panama'
  },
  'int-2-latam': {
    PY: 'services-mono-2-multi-int-2-latam-paraguay',
    SR: 'services-mono-2-multi-int-2-latam-suriname'
  }
}

const visible = computed(() => {
  let list = allCountries
  if (props.codes) list = list.filter(c => props.codes.includes(c.code))
  else if (props.exclude.length) list = list.filter(c => !props.exclude.includes(c.code))

  if (props.service) {
    const routes = serviceRoutes[props.service] || {}
    list = list.map(c => ({ ...c, active: c.code in routes }))
  }

  return [...list].sort((a, b) =>
    t(`countries.${a.code}`).localeCompare(t(`countries.${b.code}`), locale.value)
  )
})

const routeFor = (code) => {
  const routes = serviceRoutes[props.service] || serviceRoutes['coin-2-local']
  return routes[code] ? localePath(routes[code]) : undefined
}

const linkFor = (c) => c.active ? routeFor(c.code) : undefined
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
    <component
      :is="linkFor(c) ? NuxtLink : 'div'"
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
    </component>
  </div>
</template>
