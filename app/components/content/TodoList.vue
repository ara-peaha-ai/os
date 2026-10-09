<script setup>
// `::todo-list` — every `todo` MDC component, most urgent first (`pri` ascending,
// no `pri` last, ties by `when`). Without `path`: the current page; with `path`
// (folder name, as in ContentBoxes): every page under it, each todo linking to its page.
const props = defineProps({
  path: { type: String, default: null }
})

const route = useRoute()
const { locale } = useI18n()
const { toContentPath, toRoutePath } = useContentRoute()

// minimark node: a string, or [tag, props, ...children]
const textOf = node => typeof node === 'string' ? node : node.slice(2).map(textOf).join(' ')
const collect = (nodes, page, out = []) => {
  for (const node of nodes) {
    if (typeof node === 'string') continue
    const [tag, attrs] = node
    if (tag === 'todo') {
      out.push({
        text: textOf(node).replace(/\s+/g, ' ').trim(),
        to: attrs.to ?? '',
        pri: attrs.pri ?? attrs[':pri'] ?? null,
        when: attrs.when ?? null,
        page
      })
    }
    collect(node.slice(2), page, out)
  }
  return out
}

const { data: todos } = await useAsyncData(
  `todo-list-${props.path ?? route.path}-${locale.value}`,
  async () => {
    const pages = props.path
      ? await useContentQuery().where('path', 'LIKE', `/${locale.value}/${props.path}/%`).select('title', 'path', 'body').all()
      : [await useContentQuery().path(toContentPath(route.path)).select('title', 'path', 'body').first()]
    const rank = t => t.pri == null ? Infinity : Number(t.pri)
    return pages.filter(Boolean)
      .flatMap(p => collect(p.body?.value ?? [], props.path ? { title: p.title, path: toRoutePath(p.path) } : null))
      .sort((a, b) => rank(a) - rank(b) || String(a.when ?? '').localeCompare(String(b.when ?? '')))
  }
)
</script>

<template>
  <!-- ponytail: todo text renders as plain text (links/bold dropped); render the minimark children if that matters -->
  <ul v-if="todos?.length" class="space-y-2 my-6">
    <li v-for="(t, i) in todos" :key="i">
      <Todo :to="t.to" :pri="t.pri" :when="t.when">
        {{ t.text }}
      </Todo>
      <NuxtLink v-if="t.page" :to="t.page.path" class="ml-2 text-xs link-accent">{{ t.page.title }}</NuxtLink>
    </li>
  </ul>
</template>
