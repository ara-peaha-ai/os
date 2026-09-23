<script setup>
// Same visual pattern as ChainCountryList (see services/coin-2-local), but
// standalone: no per-country routing beyond linking to the country's own file
// when it has one and is active.
// `countries` is either a folder name (string, e.g. "countries" — every file
// under .../countries/*, using its own title/code/status frontmatter) or an
// explicit list of ISO codes (array), paired with the `active` codes array.
const props = defineProps({
  countries: { type: [String, Array], required: true },
  active: { type: Array, default: () => [] }
})

const { t, locale } = useI18n()
const NuxtLink = resolveComponent('NuxtLink')
const isFolder = typeof props.countries === 'string'

const { data: items } = await useAsyncData(
  `country-badges-${isFolder ? props.countries : props.countries.join(',')}-${locale.value}`,
  async () => {
    if (!isFolder) {
      return props.countries.map(code => ({
        code,
        title: t(`countries.${code}`),
        active: props.active.includes(code),
        path: null
      }))
    }
    const raw = await queryCollection('content')
      .where('path', 'LIKE', `/${locale.value}/${props.countries}/%`)
      .select('title', 'path', 'code', 'status')
      .all()
    return raw.map(item => ({
      code: (item.code || '').toUpperCase(),
      title: item.title,
      active: item.status === true || item.status === 'active',
      path: item.path
    }))
  }
)

const visible = computed(() =>
  [...(items.value || [])].sort((a, b) => a.title.localeCompare(b.title, locale.value))
)
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
    <component
      :is="c.active && c.path ? NuxtLink : 'div'"
      v-for="c in visible" :key="c.code" :to="c.active ? c.path : undefined"
      :class="[
        'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition',
        c.active ? 'border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-400 opacity-50'
      ]"
    >
      <span>{{ c.title }}</span>
      <UBadge v-if="!c.active" size="xs" color="neutral" variant="soft">soon</UBadge>
    </component>
  </div>
</template>
