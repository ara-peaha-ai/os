<script setup>
const { locale } = useI18n()
const { data: page } = await useAsyncData(`ai-multisig-${locale.value}`, () =>
  useContentQuery().where('path', '=', `/${locale.value}/ai-multisig`).first()
)
useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 space-y-10">
    <div v-if="page">
      <h1 class="text-2xl font-bold">
        {{ page.title }}
      </h1>
      <p v-if="page.subtitle" class="text-lg text-gray-500 dark:text-gray-400 mt-2">
        {{ page.subtitle }}
      </p>
      <ContentRenderer :value="page" class="prose dark:prose-invert max-w-none mt-6" />
    </div>
  </div>
</template>
