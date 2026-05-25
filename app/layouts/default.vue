<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()

const services = [
  { key: 'fiat2chain', routeName: 'services-local-2-coin', name: 'Local2Coin' },
  { key: 'chain2fiat', routeName: 'services-coin-2-local', name: 'Coin2Local' },
  { key: 'py2int', routeName: 'services-mono-2-multi-latam-2-int', name: 'Latam2Int' },
  { key: 'int2py', routeName: 'services-mono-2-multi-int-2-latam', name: 'Int2Latam' },
  { key: 'mono2multi', routeName: 'services-mono-2-multi', name: 'Mono2Multi' }
]

const menuOpen = ref(false)
watch(() => route.path, () => { menuOpen.value = false })
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="py-4" style="border-bottom: 1px solid var(--ui-border)">
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
            class="flex items-center gap-1.5 text-sm font-medium transition whitespace-nowrap"
            style="color: var(--ui-text-muted)"
            active-style="color: var(--ui-text)"
            active-class="!text-[--ui-text]"
          >
            {{ s.name }}
            <UBadge v-if="s.badge" color="primary" variant="subtle" size="xs">{{ s.badge }}</UBadge>
          </NuxtLink>
        </nav>

        <!-- Mobile burger -->
        <button
          class="sm:hidden p-2 transition"
          style="color: var(--ui-text-muted)"
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
      <div v-if="menuOpen" class="sm:hidden mt-4" style="border-top: 1px solid var(--ui-border)">
        <nav class="max-w-3xl mx-auto px-6 py-3 flex flex-col gap-1">
          <NuxtLink
            v-for="s in services"
            :key="s.key"
            :to="localePath(s.routeName)"
            class="flex items-center justify-between py-3 text-sm font-medium transition last:border-0"
            style="color: var(--ui-text-muted); border-bottom: 1px solid var(--ui-border-muted)"
            active-class="!text-[--ui-text]"
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

    <footer style="border-top: 1px solid var(--ui-border)">
      <div class="max-w-3xl mx-auto px-6 py-4 flex flex-col items-center gap-4">

        <!-- Social icons -->
        <div class="flex items-center gap-5">
          <a href="https://github.com/P2Pagos" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </a>
          <a href="https://t.me/P2Pagos" target="_blank" rel="noopener noreferrer" aria-label="Telegram" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/P2Pagos" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
          </a>
          <a href="https://x.com/P2Pagos" target="_blank" rel="noopener noreferrer" aria-label="X" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/P2Pagos" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/@P2Pagos" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="mailto:hola@p2pagos.com" aria-label="Email" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
          <a href="https://keys.openpgp.org/vks/v1/by-fingerprint/8CF6C82CF6DFD2E3ED822528AF6D0913C2F413A0" target="_blank" rel="noopener noreferrer" aria-label="PGP key" class="transition" style="color: var(--ui-text-dimmed)">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.65 10C11.83 7.67 9.61 6 7 6a6 6 0 0 0 0 12c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </a>
        </div>

        <!-- Footer nav links -->
        <div class="flex justify-center gap-5">
          <NuxtLink
            :to="localePath('insights')"
            class="text-sm transition link-accent"
          >
            {{ locale === 'nl' ? 'Inzichten' : locale === 'pt' || locale === 'es' ? 'Perspectivas' : 'Insights' }}
          </NuxtLink>
          <a
            href="/doc"
            class="text-sm transition link-accent"
          >
            {{ locale === 'es' ? 'Documentación' : locale === 'pt' ? 'Documentação' : locale === 'nl' ? 'Documentatie' : 'Documentation' }}
          </a>
        </div>

        <!-- Locale switcher -->
        <div class="flex justify-center gap-3">
          <template v-for="loc in locales" :key="loc.code">
            <NuxtLink
              v-if="loc.code !== locale"
              :to="switchLocalePath(loc.code)"
              class="text-sm transition link-accent"
            >
              {{ loc.name }}
            </NuxtLink>
            <span v-else class="text-sm font-medium">{{ loc.name }}</span>
          </template>
        </div>

      </div>
    </footer>
  </div>
</template>
