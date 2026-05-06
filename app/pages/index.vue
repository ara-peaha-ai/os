<script setup>
const { locale } = useI18n()
const localePath = useLocalePath()

const { data: page } = await useAsyncData(`home-${locale.value}`, () =>
  queryCollection('content').where('path', '=', `/${locale.value}`).first()
)

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div v-if="page" class="max-w-3xl mx-auto p-6 space-y-10">
    <section class="space-y-3">
      <h1 class="text-3xl font-semibold tracking-tight">
        {{ page.hero.h1 }}
      </h1>
      <p v-if="page.hero.subtitle" class="text-lg text-gray-500 dark:text-gray-400">
        {{ page.hero.subtitle }}
      </p>
    </section>

    <ServiceAnimation />

    <section class="space-y-3">
      <p v-for="(para, i) in page.hero.paragraphs" :key="i" class="text-gray-700 dark:text-gray-300">
        {{ para }}
      </p>
    </section>

    <section class="space-y-6">
      <span v-if="page.products.anchor" :id="page.products.anchor" class="sr-only" />
      <div class="space-y-2">
        <p class="text-sm uppercase tracking-wide text-gray-500">{{ page.products.label }}</p>
        <h2 class="text-2xl font-semibold">{{ page.products.h2 }}</h2>
        <p v-if="page.products.intro" class="text-gray-700 dark:text-gray-300">{{ page.products.intro }}</p>
        <p v-for="(para, i) in page.products.paragraphs" :key="i" class="text-gray-700 dark:text-gray-300">{{ para }}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="item in page.products.items"
          :key="item.slug"
          :to="localePath(`services-${item.slug}`)"
          class="block rounded-xl border p-5 hover:border-primary transition"
        >
          <p class="text-xs uppercase tracking-wide text-gray-500">{{ item.label }}</p>
          <h3 class="mt-1 text-lg font-semibold">{{ item.name }}</h3>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{{ item.description }}</p>
          <p v-if="item.linkText" class="mt-3 text-sm font-medium text-primary">{{ item.linkText }} →</p>
        </NuxtLink>
      </div>
    </section>

    <section class="space-y-6">
      <span v-if="page.advisory.anchor" :id="page.advisory.anchor" class="sr-only" />
      <div class="space-y-2">
        <p class="text-sm uppercase tracking-wide text-gray-500">{{ page.advisory.label }}</p>
        <h2 class="text-2xl font-semibold">{{ page.advisory.h2 }}</h2>
        <p v-if="page.advisory.intro" class="text-gray-700 dark:text-gray-300">{{ page.advisory.intro }}</p>
        <p v-for="(para, i) in page.advisory.paragraphs" :key="i" class="text-gray-700 dark:text-gray-300">{{ para }}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="item in page.advisory.items"
          :key="item.slug"
          :to="localePath(`services-${item.slug}`)"
          class="block rounded-xl border p-5 hover:border-primary transition"
        >
          <p class="text-xs uppercase tracking-wide text-gray-500">{{ item.label }}</p>
          <h3 class="mt-1 text-lg font-semibold">{{ item.name }}</h3>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{{ item.description }}</p>
          <p v-if="item.linkText" class="mt-3 text-sm font-medium text-primary">{{ item.linkText }} →</p>
        </NuxtLink>
      </div>
    </section>

    <section class="rounded-xl border p-6 space-y-3">
      <p class="text-sm uppercase tracking-wide text-gray-500">{{ page.thesis.label }}</p>
      <h2 class="text-2xl font-semibold">{{ page.thesis.h2 }}</h2>
      <p v-for="(para, i) in page.thesis.paragraphs" :key="i" class="text-gray-700 dark:text-gray-300">{{ para }}</p>
      <NuxtLink :to="localePath(`services-${page.thesis.ctaSlug}`)" class="text-sm font-medium text-primary">
        {{ page.thesis.cta }} →
      </NuxtLink>
    </section>

    <section v-if="page.verticals" class="space-y-6">
      <div class="space-y-2">
        <p class="text-sm uppercase tracking-wide text-gray-500">{{ page.verticals.label }}</p>
        <h2 class="text-2xl font-semibold">{{ page.verticals.h2 }}</h2>
        <p v-if="page.verticals.intro" class="text-gray-700 dark:text-gray-300">{{ page.verticals.intro }}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <component
          :is="item.slug ? 'a' : 'div'"
          v-for="item in page.verticals.items"
          :key="item.name"
          v-bind="item.slug ? { href: '/' + item.slug } : {}"
          class="block rounded-xl border p-5 transition"
          :class="item.slug ? 'hover:border-primary cursor-pointer' : 'border-dashed opacity-70'"
        >
          <p class="text-xs uppercase tracking-wide text-gray-500">{{ item.label }}</p>
          <h3 class="mt-1 text-lg font-semibold">{{ item.name }}</h3>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">{{ item.description }}</p>
          <p v-if="item.linkText" class="mt-3 text-sm font-medium text-primary">{{ item.linkText }} →</p>
          <p v-if="item.eta" class="mt-3 text-xs text-gray-400">{{ item.eta }}</p>
        </component>
      </div>
    </section>
  </div>
</template>
