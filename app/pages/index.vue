<script setup>
const { locale } = useI18n()
const localePath = useLocalePath()

const { data: page } = await useAsyncData(`home-${locale.value}`, () =>
  useContentQuery().where('path', '=', `/${locale.value}`).first()
)

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div v-if="page" class="max-w-3xl mx-auto p-6 space-y-10">
    <section class="space-y-3">
      <h1 class="text-3xl font-bold tracking-tight" style="color: var(--ui-text)">
        {{ page.hero.h1 }}
      </h1>
      <p v-if="page.hero.subtitle" class="text-lg" style="color: var(--ui-text-muted)">
        {{ page.hero.subtitle }}
      </p>
    </section>

    <ServiceAnimation />

    <AppSeparator />

    <section class="space-y-3">
      <p v-for="(para, i) in page.hero.paragraphs" :key="i" style="color: var(--ui-text-tinted)">
        {{ para }}
      </p>
    </section>

    <AppSeparator />

    <section class="space-y-6">
      <span v-if="page.products.anchor" :id="page.products.anchor" class="sr-only" />
      <div class="space-y-2">
        <AppSectionLabel :label="page.products.label" />
        <h2 class="section-title text-2xl">{{ page.products.h2 }}</h2>
        <p v-if="page.products.intro" style="color: var(--ui-text-tinted)">{{ page.products.intro }}</p>
        <p v-for="(para, i) in page.products.paragraphs" :key="i" style="color: var(--ui-text-tinted)">{{ para }}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="item in page.products.items"
          :key="item.slug"
          :to="localePath(`services-${item.slug}`)"
          class="block rounded-xl border p-5 transition"
          style="border-color: var(--ui-border)"
        >
          <AppSectionLabel :label="item.label" />
          <h3 class="mt-1 text-lg font-semibold" style="color: var(--ui-text)">{{ item.name }}</h3>
          <p class="mt-2 text-sm" style="color: var(--ui-text-muted)">{{ item.description }}</p>
          <p v-if="item.linkText" class="mt-3 text-sm font-medium link-accent">{{ item.linkText }} →</p>
        </NuxtLink>
      </div>
    </section>

    <AppSeparator />

    <section class="space-y-6">
      <span v-if="page.advisory.anchor" :id="page.advisory.anchor" class="sr-only" />
      <div class="space-y-2">
        <AppSectionLabel :label="page.advisory.label" />
        <h2 class="section-title text-2xl">{{ page.advisory.h2 }}</h2>
        <p v-if="page.advisory.intro" style="color: var(--ui-text-tinted)">{{ page.advisory.intro }}</p>
        <p v-for="(para, i) in page.advisory.paragraphs" :key="i" style="color: var(--ui-text-tinted)">{{ para }}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="item in page.advisory.items"
          :key="item.slug"
          :to="localePath(`services-${item.slug}`)"
          class="block rounded-xl border p-5 transition"
          style="border-color: var(--ui-border)"
        >
          <AppSectionLabel :label="item.label" />
          <h3 class="mt-1 text-lg font-semibold" style="color: var(--ui-text)">{{ item.name }}</h3>
          <p class="mt-2 text-sm" style="color: var(--ui-text-muted)">{{ item.description }}</p>
          <p v-if="item.linkText" class="mt-3 text-sm font-medium link-accent">{{ item.linkText }} →</p>
        </NuxtLink>
      </div>
    </section>

    <AppSeparator />

    <section class="rounded-xl border p-6 space-y-3" style="border-color: var(--ui-border); background-color: var(--ui-bg-muted)">
      <AppSectionLabel :label="page.thesis.label" />
      <h2 class="section-title text-2xl">{{ page.thesis.h2 }}</h2>
      <p v-for="(para, i) in page.thesis.paragraphs" :key="i" style="color: var(--ui-text-tinted)">{{ para }}</p>
      <NuxtLink :to="localePath(`services-${page.thesis.ctaSlug}`)" class="text-sm font-medium link-accent">
        {{ page.thesis.cta }} →
      </NuxtLink>
    </section>

    <section v-if="page.verticals" class="space-y-6">
      <div class="space-y-2">
        <AppSectionLabel :label="page.verticals.label" />
        <h2 class="section-title text-2xl">{{ page.verticals.h2 }}</h2>
        <p v-if="page.verticals.intro" style="color: var(--ui-text-tinted)">{{ page.verticals.intro }}</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <component
          :is="item.slug ? 'NuxtLinkLocale' : 'div'"
          v-for="item in page.verticals.items"
          :key="item.name"
          v-bind="item.slug ? { to: '/' + item.slug } : {}"
          class="block rounded-xl border p-5 transition"
          :class="item.slug ? 'cursor-pointer' : 'border-dashed opacity-60'"
          :style="item.slug
            ? 'border-color: var(--ui-border)'
            : 'border-color: var(--ui-border-accented)'"
        >
          <AppSectionLabel :label="item.label" />
          <h3 class="mt-1 text-lg font-semibold" style="color: var(--ui-text)">{{ item.name }}</h3>
          <p class="mt-2 text-sm" style="color: var(--ui-text-muted)">{{ item.description }}</p>
          <p v-if="item.linkText" class="mt-3 text-sm font-medium link-accent">{{ item.linkText }} →</p>
          <p v-if="item.eta" class="mt-3 text-xs" style="color: var(--ui-text-dimmed)">{{ item.eta }}</p>
        </component>
      </div>
    </section>
  </div>
</template>
