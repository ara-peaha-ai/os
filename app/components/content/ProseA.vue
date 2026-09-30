<script setup>
const props = defineProps({
  href: { type: String, default: '' },
  target: { type: String, default: null },
  class: { type: null, default: null }
})

const isExternal = computed(() => /^https?:\/\//.test(props.href))
</script>

<template>
  <ULink
    :href="withUtm(href)"
    :target="target ?? (isExternal ? '_blank' : undefined)"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="text-primary border-b border-transparent hover:border-primary font-medium transition-colors hover:decoration-dotted"
    raw
  >
    <slot />
  </ULink>
</template>
