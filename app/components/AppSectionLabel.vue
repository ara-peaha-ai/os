<script setup>
defineProps({
  label: { type: String, required: true }
})
</script>

<template>
  <p class="app-section-label">{{ label }}</p>
</template>

<style scoped>
.app-section-label {
  font-size: 0.70rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-dimmed);
}
</style>
