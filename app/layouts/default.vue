<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800 py-4">
      <div class="max-w-3xl mx-auto px-6 flex justify-center gap-3">
        <template v-for="loc in locales" :key="loc.code">
          <NuxtLink
            v-if="loc.code !== locale"
            :to="switchLocalePath(loc.code)"
            class="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition"
          >
            {{ loc.name }}
          </NuxtLink>
          <span v-else class="text-sm font-medium">{{ loc.name }}</span>
        </template>
      </div>
    </footer>
  </div>
</template>
