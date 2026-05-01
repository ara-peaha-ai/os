<script setup>
const props = defineProps({
  content: Object
})

const route = useRoute()
const localePath = useLocalePath()

useHead(() => ({
  title: props.content?.title
}))

const showCountries = computed(() => route.path.includes('chain-2-fiat'))

const paraguayPath = computed(() => localePath('services-chain-2-fiat-paraguay'))

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

const countryLinks = { PY: paraguayPath }
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <div v-if="content">
      <h1 class="text-2xl font-bold">
        {{ content.title }}
      </h1>
      <p v-if="content.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">
        {{ content.subtitle }}
      </p>
    </div>

    <div class="rounded-xl overflow-hidden">
      <img :src="'/fiat-to-chain.gif'" alt="" class="w-full" />
    </div>

    <ContentRenderer v-if="content" :value="content" class="prose dark:prose-invert max-w-none" />

    <div v-if="showCountries" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <NuxtLink v-for="c in countries" :key="c.code" :to="c.active ? countryLinks[c.code] : undefined" :class="[
        'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition',
        c.active
          ? 'border-primary hover:bg-primary/10 cursor-pointer'
          : 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed opacity-50'
      ]">
        <span>{{ c.name }}</span>
        <UBadge v-if="!c.active" size="xs" color="neutral" variant="soft">
          soon
        </UBadge>
      </NuxtLink>
    </div>
  </div>
</template>
