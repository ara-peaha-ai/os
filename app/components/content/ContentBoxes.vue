<script setup>
// `paths` is either a folder name (string, e.g. "divisions" — every file under
// content/original/web/divisions/*) or a list of individual file paths (array).
const props = defineProps({
  paths: { type: [String, Array], required: true }
})

const { t, locale } = useI18n()
const { toRoutePath } = useContentRoute()

const { data: items } = await useAsyncData(
  `content-boxes-${Array.isArray(props.paths) ? props.paths.join(',') : props.paths}-${locale.value}`,
  async () => {
    const raw = typeof props.paths === 'string'
      ? await queryCollection('content')
          .where('path', 'LIKE', `/${locale.value}/${props.paths}/%`)
          .select('title', 'path', 'rawbody', 'disable', 'stem', 'badge')
          .order('stem', 'ASC')
          .all()
      : await Promise.all(
          props.paths.map(p => queryCollection('content').path(`/${locale.value}/${p}`).select('title', 'path', 'rawbody', 'disable', 'badge').first())
        )
    // ContentRenderer (not bare MDC/MDCRenderer) is the only one with access to
    // the app's Prose* component overrides, so links in excerpts resolve correctly.
    const { parseMarkdown } = await import('@nuxtjs/mdc/runtime')
    return Promise.all(raw.map(async (item) => {
      if (!item) return item
      const { excerpt } = await parseMarkdown(item.rawbody)
      return { ...item, excerptBody: excerpt }
    }))
  }
)

// Tailwind needs the full class name literally in source to generate it, so a
// dynamic `sm:grid-cols-${n}` string wouldn't work — map to a fixed literal instead.
const gridClass = computed(() => ({ 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2' })[items.value?.length] || 'sm:grid-cols-3')
</script>

<template>
  <div class="grid gap-4" :class="gridClass">
    <div
      v-for="item in items"
      :key="item?.path"
      class="rounded-xl border p-5"
      style="border-color: var(--ui-border)"
    >
      <template v-if="item">
        <div class="flex items-baseline gap-2 flex-wrap">
          <h3 class="text-lg font-semibold" style="color: var(--ui-text)">{{ item.title }}</h3>
          <UBadge v-if="item.badge" color="primary" variant="subtle" size="sm" class="shrink-0">{{ item.badge }}</UBadge>
        </div>
        <div class="mt-2 text-sm [&>*]:m-0" style="color: var(--ui-text-muted)">
          <ContentRenderer v-if="item.excerptBody" :value="{ body: item.excerptBody }" prose />
        </div>
        <NuxtLink v-if="!item.disable" :to="toRoutePath(item.path)" class="mt-3 inline-block text-sm font-medium link-accent">
          {{ t('content.learnMore') }} →
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
