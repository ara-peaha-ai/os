<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()

const services = [
  { key: 'fiat2chain', routeName: 'services-local-2-coin', name: 'Local2Coin' },
  { key: 'chain2fiat', routeName: 'services-coin-2-local', name: 'Coin2Local', badge: 'Moonshot' },
  { key: 'py2int', routeName: 'services-mono-2-multi-latam-2-int', name: 'Latam2Int' },
  { key: 'int2py', routeName: 'services-mono-2-multi-int-2-latam', name: 'Int2Latam' },
  { key: 'mono2multi', routeName: 'services-mono-2-multi', name: 'Mono2Multi' }
]

const menuOpen = ref(false)
watch(() => route.path, () => { menuOpen.value = false })
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-gray-200 dark:border-gray-800 py-4">
      <div class="max-w-3xl mx-auto px-6 flex items-center justify-between gap-8">
        <NuxtLinkLocale to="/" class="flex items-center gap-2 shrink-0">
          <img src="/p2pagos-logo.png" alt="P2Pagos" class="h-8 w-auto" />
          <span class="font-semibold text-lg">P2Pagos</span>
        </NuxtLinkLocale>

        <!-- Desktop nav -->
        <nav class="hidden sm:flex items-center gap-6">
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

        <!-- Mobile burger -->
        <button
          class="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
          @click="menuOpen = !menuOpen"
          aria-label="Menu"
        >
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="menuOpen" class="sm:hidden border-t border-gray-200 dark:border-gray-800 mt-4">
        <nav class="max-w-3xl mx-auto px-6 py-3 flex flex-col gap-1">
          <NuxtLink
            v-for="s in services"
            :key="s.key"
            :to="localePath(s.routeName)"
            class="flex items-center justify-between py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition border-b border-gray-100 dark:border-gray-800 last:border-0"
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
