<script setup>
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const { data: pageContent } = await useAsyncData(`services-hub-${route.path}`, () =>
  queryCollection('content').where('path', 'LIKE', `%${route.path}`).first()
)

useHead(() => ({
  title: pageContent.value?.title
}))

const services = [
  { key: 'fiat2chain', routeName: 'services-fiat-2-chain', name: 'Fiat2Chain' },
  { key: 'chain2fiat', routeName: 'services-chain-2-fiat', name: 'Chain2Fiat' },
  { key: 'eas2us', routeName: 'services-eas-2-us', name: 'EAS2US' },
  { key: 'llc2py', routeName: 'services-llc-2-py', name: 'LLC2PY' }
]
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <div v-if="pageContent">
      <h1 class="text-2xl font-bold">
        {{ pageContent.title }}
      </h1>
      <p v-if="pageContent.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">
        {{ pageContent.subtitle }}
      </p>
      <ContentRenderer :value="pageContent" class="prose dark:prose-invert max-w-none mt-6" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink
        v-for="s in services"
        :key="s.key"
        :to="localePath(s.routeName)"
        class="block p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition"
      >
        <h2 class="text-lg font-bold">
          {{ s.name }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ t(`services.${s.key}`) }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
