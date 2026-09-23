<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()
const { public: { socials } } = useRuntimeConfig()

// Order follows sovereign/content/socials.pub.yaml — icons from the already
// installed simple-icons/lucide collections, not hand-copied SVGs.
const socialMeta = {
  executive: { icon: 'lucide:contact', label: 'Digital business card' },
  github: { icon: 'simple-icons:github', label: 'GitHub' },
  telegram: { icon: 'simple-icons:telegram', label: 'Telegram' },
  linkedin: { icon: 'simple-icons:linkedin', label: 'LinkedIn' },
  x: { icon: 'simple-icons:x', label: 'X' },
  reddit: { icon: 'simple-icons:reddit', label: 'Reddit' },
  youtube: { icon: 'simple-icons:youtube', label: 'YouTube' },
  instagram: { icon: 'simple-icons:instagram', label: 'Instagram' },
  email: { icon: 'lucide:mail', label: 'Email' },
  pgp: { icon: 'simple-icons:gnuprivacyguard', label: 'PGP key' }
}
const socialLinks = computed(() => socials.map(([key, value]) => ({
  key,
  href: key === 'email' ? `mailto:${value}` : value,
  ...socialMeta[key]
})).filter(s => s.icon))

const services = [
  { key: 'fiat2chain', routeName: 'services-local-2-coin', name: 'Local2Coin' },
  { key: 'chain2fiat', routeName: 'services-coin-2-local', name: 'Coin2Local' },
  { key: 'py2int', routeName: 'services-mono-2-multi-latam-2-int', name: 'Latam2Int' },
  { key: 'int2py', routeName: 'services-mono-2-multi-int-2-latam', name: 'Int2Latam' },
  { key: 'mono2multi', routeName: 'services-mono-2-multi', name: 'Mono2Multi' }
]

const menuOpen = ref(false)
watch(() => route.path, () => { menuOpen.value = false })

// Advertises the clean-markdown twin of every page (see server/routes/raw/)
// via the standard rel="alternate" link, so crawlers landing on the HTML
// directly (not via /llms.txt) can still discover it.
const rawHref = computed(() => {
  const prefixed = route.path === `/${locale.value}` || route.path.startsWith(`/${locale.value}/`)
  const rest = prefixed ? route.path.slice(locale.value.length + 1) : route.path
  const base = prefixed ? `/${locale.value}/raw` : '/raw'
  return rest === '' || rest === '/' ? `${base}/index.md` : `${base}${rest}.md`
})

useHead(() => ({
  link: route.meta.noRawMarkdown
    ? []
    : [{ rel: 'alternate', type: 'text/markdown', href: rawHref.value }]
}))
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="py-4" style="border-bottom: 1px solid var(--ui-border)">
      <div class="max-w-3xl mx-auto px-6 flex items-center justify-between gap-8">
        <NuxtLinkLocale to="/" class="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="" class="h-8 w-auto" />
          <span class="font-semibold text-lg">Ára Pe'aha Aĩ</span>
        </NuxtLinkLocale>

        <!-- Desktop nav -->
        <nav class="hidden sm:flex items-center gap-6">
          <NuxtLink v-for="s in services" :key="s.key" :to="localePath(s.routeName)"
            class="flex items-center gap-1.5 text-sm font-medium transition whitespace-nowrap"
            style="color: var(--ui-text-muted)" active-style="color: var(--ui-text)" active-class="!text-[--ui-text]">
            {{ s.name }}
            <UBadge v-if="s.badge" color="primary" variant="subtle" size="xs">{{ s.badge }}</UBadge>
          </NuxtLink>
        </nav>

        <!-- Mobile burger -->
        <button class="sm:hidden p-2 transition" style="color: var(--ui-text-muted)" @click="menuOpen = !menuOpen"
          aria-label="Menu">
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="menuOpen" class="sm:hidden mt-4" style="border-top: 1px solid var(--ui-border)">
        <nav class="max-w-3xl mx-auto px-6 py-3 flex flex-col gap-1">
          <NuxtLink v-for="s in services" :key="s.key" :to="localePath(s.routeName)"
            class="flex items-center justify-between py-3 text-sm font-medium transition last:border-0"
            style="color: var(--ui-text-muted); border-bottom: 1px solid var(--ui-border-muted)"
            active-class="!text-[--ui-text]">
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

        <!-- Social icons — order and list from sovereign/content/socials.pub.yaml -->
        <div class="flex items-center gap-5">
          <a v-for="s in socialLinks" :key="s.key" :href="s.href" :target="s.key === 'email' ? undefined : '_blank'"
            :rel="s.key === 'email' ? undefined : 'noopener noreferrer'" :aria-label="s.label" class="transition"
            style="color: var(--ui-text-dimmed)">
            <Icon :name="s.icon" class="w-5 h-5" />
          </a>
        </div>

        <!-- Footer nav links -->
        <div class="flex justify-center gap-5">
          <NuxtLink :to="localePath('insights')" class="text-sm transition link-accent">
            {{ locale === 'br' || locale === 'lat' ? 'Perspectivas' : 'Insights' }}
          </NuxtLink>
          <a href="/doc" class="text-sm transition link-accent">
            {{ locale === 'lat' ? 'Documentación' : locale === 'br' ? 'Documentação' : 'Documentation' }}
          </a>
        </div>

        <!-- Locale switcher -->
        <div class="flex justify-center gap-3">
          <template v-for="loc in locales" :key="loc.code">
            <NuxtLink v-if="loc.code !== locale" :to="switchLocalePath(loc.code)"
              class="text-sm transition link-accent">
              {{ loc.name }}
            </NuxtLink>
            <span v-else class="text-sm font-medium">{{ loc.name }}</span>
          </template>
        </div>

      </div>
    </footer>
  </div>
</template>
