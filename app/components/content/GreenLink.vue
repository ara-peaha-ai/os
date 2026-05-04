<script setup>
defineProps({ to: { type: String, required: true }, text: { type: String, required: true } })
</script>

<template>
  <NuxtLink :to="to" class="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
    {{ text }} →
  </NuxtLink>
</template>
