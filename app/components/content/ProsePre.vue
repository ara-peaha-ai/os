<script setup>
defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  highlights: { type: Array, default: () => [] },
  meta: { type: String, default: null }
})
</script>

<template>
  <ClientOnly v-if="language === 'mermaid'">
    <MermaidDiagram :code="code" />
    <template #fallback>
      <div class="h-40 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </template>
  </ClientOnly>
  <pre v-else :class="language && `language-${language}`"><slot /></pre>
</template>
