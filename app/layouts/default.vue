<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const services = [
  { key: 'fiat2chain', routeName: 'services-local-2-coin', name: 'Local2Coin' },
  { key: 'chain2fiat', routeName: 'services-coin-2-local', name: 'Coin2Local', badge: 'Moonshot' },
  { key: 'py2int', routeName: 'services-mono-2-multi-latam-2-int', name: 'LATAM2Int' },
  { key: 'mono2multi', routeName: 'services-mono-2-multi', name: 'Mono2Multi' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-gray-200 dark:border-gray-800 py-4">
      <div class="max-w-3xl mx-auto px-6 flex items-center justify-between gap-8">
        <NuxtLinkLocale to="/" class="flex items-center gap-2 shrink-0">
          <img src="/p2pagos-logo.png" alt="P2Pagos" class="h-8 w-auto" />
          <span class="font-semibold text-lg">P2Pagos</span>
        </NuxtLinkLocale>

        <nav class="flex items-center gap-6 overflow-x-auto">
          <NuxtLink
            v-for="s in services"
            :key="s.key"
            :to="localePath(s.routeName)"
            class="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition whitespace-nowrap"
            active-class="text-gray-900 dark:text-gray-100"
          >
            {{ s.name }}
            <UBadge v-if="s.badge" color="primary" variant="subtle" size="xs">{{ s.badge }}</UBadge>
          </NuxtLink>
        </nav>
      </div>
    </header>

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
