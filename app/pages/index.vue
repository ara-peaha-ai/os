<script setup>
const { locale } = useI18n()

const { data: page } = await useAsyncData(`home-${locale.value}`, () =>
  useContentQuery().where('path', '=', `/${locale.value}`).first()
)

useSeoMeta({
  title: () => page.value?.title,
  description: () => [page.value?.description, page.value?.tags?.join(' · ')].filter(Boolean).join(' — ')
})
</script>

<template>
  <div v-if="page" class="max-w-3xl mx-auto p-6 space-y-10">
    <section class="space-y-3">
      <h1 class="text-3xl font-bold tracking-tight" style="color: var(--ui-text)">
        {{ page.title }}
      </h1>
      <p v-if="page.description" class="text-lg" style="color: var(--ui-text-muted)">
        {{ page.description }}
      </p>
      <p v-if="page.tags?.length" class="text-lg font-medium" style="color: var(--ui-text)">
        {{ page.tags.join(' · ') }}
      </p>
    </section>

    <ServiceAnimation />

    <AppSeparator />

    <ContentRenderer :value="page" class="space-y-10" style="color: var(--ui-text-tinted)" />
  </div>
</template>
