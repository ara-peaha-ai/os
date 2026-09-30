<script setup>
// `paths` is either a folder name (string, e.g. "divisions" — every file under
// content/original/web/divisions/*) or a list of individual file paths (array).
// `nav` names a group of the homepage frontmatter `nav` instead (see useNav), so
// the boxes and the navbar read the same list.
const props = defineProps({
  paths: { type: [String, Array], default: null },
  nav: { type: String, default: null },
  // Box widths as fractions of the row, wrapping like Bulma's is-multiline:
  // one number for every box (`width: 1`) or one per box in order
  // (`width: [0.5, 0.5, 1]`, the last value repeats). Full width on mobile.
  width: { type: [Number, Array], default: null }
})
const navGroups = props.nav ? await useNav() : null
const paths = props.nav ? navGroups.value[props.nav] ?? [] : props.paths

const { t, locale } = useI18n()
const { toRoutePath } = useContentRoute()

const NuxtLink = resolveComponent('NuxtLink')
// entityLink: absolute URL through withUtm, otherwise a content path under the current locale
const entityTo = link => link.startsWith('http') ? withUtm(link) : toRoutePath(`/${locale.value}/${link}`)

const { data: items } = await useAsyncData(
  `content-boxes-${Array.isArray(paths) ? paths.join(',') : paths}-${locale.value}`,
  async () => {
    const raw = typeof paths === 'string'
      ? await queryCollection('content')
          .where('path', 'LIKE', `/${locale.value}/${paths}/%`)
          .select('title', 'path', 'rawbody', 'disable', 'stem', 'badge', 'entity', 'entityLink')
          .order('stem', 'ASC')
          .all()
      : await Promise.all(
          paths.map(p => queryCollection('content').path(`/${locale.value}/${p}`).select('title', 'path', 'rawbody', 'disable', 'badge', 'entity', 'entityLink').first())
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

// Without `width`: 1, 2 or 3 per row by box count, as before.
// A value that isn't a number in (0, 1] falls back to that default.
const widthOf = (i) => {
  const fallback = 1 / Math.min(items.value?.length || 1, 3)
  if (props.width == null) return fallback
  const list = [props.width].flat()
  const w = Number(list[Math.min(i, list.length - 1)])
  return Number.isFinite(w) && w > 0 && w <= 1 ? w : fallback
}
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <!-- width minus its share of the gap-4 gaps, so fractions summing to 1 fill a row -->
    <div
      v-for="(item, i) in items"
      :key="item?.path"
      class="relative rounded-xl border p-5 w-full sm:w-[calc(var(--w)*100%_-_(1_-_var(--w))*var(--spacing)*4)]"
      :style="{ borderColor: 'var(--ui-border)', '--w': widthOf(i) }"
    >
      <template v-if="item">
        <component
          :is="item.entityLink ? NuxtLink : 'span'"
          v-if="item.entity"
          v-bind="item.entityLink ? { to: entityTo(item.entityLink), external: item.entityLink.startsWith('http') } : {}"
          class="absolute top-2 right-3 text-[10px] font-medium uppercase tracking-wider hover:underline"
          style="color: var(--ui-text-dimmed)"
        >
          {{ item.entity }}
        </component>
        <div class="flex items-baseline gap-2 flex-wrap">
          <h3 class="text-lg font-semibold" style="color: var(--ui-text)">{{ item.title }}</h3>
          <UBadge v-for="b in [item.badge].flat().filter(Boolean)" :key="b" color="primary" variant="subtle" size="sm" class="shrink-0">{{ b }}</UBadge>
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
