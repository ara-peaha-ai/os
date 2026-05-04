<script setup>
const props = defineProps({
  code: { type: String, required: true }
})

const colorMode = useColorMode()
const container = ref(null)
const svg = ref('')
const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
const isFullscreen = ref(false)

const themeCss = {
  light: `<style>
.node rect,.node circle,.node ellipse,.node polygon,.node path,.node .label-container{fill:#5589C8!important;stroke:#2E5AA0!important}
.nodeLabel,.nodeLabel p,.nodeLabel div{color:#fff!important}
.flowchart-link,.edgePath .path{stroke:#4169A8!important;fill:none!important}
.cluster rect{fill:#EBF3FA!important;stroke:#00DC82!important;stroke-width:2px!important}
.cluster-label .nodeLabel,.cluster-label .nodeLabel p,.clusterLabel{color:#3D5A80!important;fill:#3D5A80!important}
.edgeLabel rect{fill:#EBF3FA!important;stroke:none!important}
.edgeLabel span,.edgeLabel p,.edgeLabel div{color:#3D5A80!important}
marker path{fill:#00DC82!important;stroke:#00DC82!important}
</style>`,
  dark: `<style>
.node rect,.node circle,.node ellipse,.node polygon,.node path,.node .label-container{fill:#2E5AA0!important;stroke:#00DC82!important;stroke-width:1.5px!important}
.nodeLabel,.nodeLabel p,.nodeLabel div{color:#fff!important}
.flowchart-link,.edgePath .path{stroke:#6389C8!important;fill:none!important}
.cluster rect{fill:#1a2d45!important;stroke:#00DC82!important;stroke-width:2px!important}
.cluster-label .nodeLabel,.cluster-label .nodeLabel p,.clusterLabel{color:#B8CCE8!important;fill:#B8CCE8!important}
.edgeLabel rect{fill:#1a2d45!important;stroke:none!important}
.edgeLabel span,.edgeLabel p,.edgeLabel div{color:#B8CCE8!important}
marker path{fill:#00DC82!important;stroke:#00DC82!important}
</style>`
}

const toggleFullscreen = () => {
  if (isFullscreen.value) {
    document.exitFullscreen()
  } else {
    container.value?.requestFullscreen?.()
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(async () => {
  document.addEventListener('fullscreenchange', onFullscreenChange)

  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({ startOnLoad: false, theme: 'base' })
  try {
    const { svg: rendered } = await mermaid.render(id, props.code)
    const css = themeCss[colorMode.value] ?? themeCss.light
    svg.value = rendered.replace('</svg>', `${css}</svg>`)
  } catch {
    svg.value = ''
  }
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <div v-if="svg" ref="container" class="mermaid-wrap relative group overflow-x-auto">
    <button
      class="absolute top-2 right-2 z-10 p-1.5 rounded transition-opacity bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 shadow-sm"
      :class="isFullscreen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
      @click="toggleFullscreen"
    >
      <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4m0 5H4m0 0l5-5M15 9h5m-5 0V4m0 5l5-5M9 15H4m5 0v5m0-5l-5 5M15 15h5m-5 0v5m0-5l5 5" />
      </svg>
    </button>
    <div v-html="svg" />
  </div>
  <pre v-else class="text-xs opacity-40"><code>{{ code }}</code></pre>
</template>

<style>
.mermaid-wrap:fullscreen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 2rem;
  overflow: auto;
}
.dark .mermaid-wrap:fullscreen {
  background: #111827;
}
.mermaid-wrap:fullscreen svg {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
}
</style>
