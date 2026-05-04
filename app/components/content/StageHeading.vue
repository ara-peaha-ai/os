<script setup>
defineProps({
  text: { type: String, required: true },
  badge: { type: String, default: null }
})
</script>

<template>
  <h2 class="flex items-baseline gap-3">
    {{ text }}
    <UBadge v-if="badge" color="primary" variant="subtle" size="sm" class="shrink-0 font-normal">
      {{ badge }}
    </UBadge>
  </h2>
</template>
