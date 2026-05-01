<script setup>
const props = defineProps({
  code: { type: String, required: true }
})

const colorMode = useColorMode()
const svg = ref('')
const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`

onMounted(async () => {
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    theme: colorMode.value === 'dark' ? 'dark' : 'neutral'
  })
  try {
    const { svg: rendered } = await mermaid.render(id, props.code)
    svg.value = rendered
  } catch {
    svg.value = ''
  }
})
</script>

<template>
  <div v-if="svg" class="overflow-x-auto" v-html="svg" />
  <pre v-else class="text-xs opacity-40"><code>{{ code }}</code></pre>
</template>
