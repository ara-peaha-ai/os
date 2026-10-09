import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ponytail: trivial flat "key: value" file, a couple lines of parsing beats a
// YAML dependency. Read from the sovereign checkout when present (local dev),
// otherwise from the copy in content/ (CI builds have no sovereign checkout yet).
const sovereignSocials = resolve(process.env.NUXT_SOVEREIGN_CONTENT_DIR || '../sovereign', 'content/socials.pub.yaml')
const socialsPath = existsSync(sovereignSocials) ? sovereignSocials : resolve('content/socials.pub.yaml')
const socials = existsSync(socialsPath)
  ? readFileSync(socialsPath, 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const i = line.indexOf(':')
        return [line.slice(0, i).trim(), line.slice(i + 1).trim()]
      })
  : []

// Production host per locale: i18n domains below, and the hosts withUtm() treats as this site
const localeDomains = { int: 'int.peaha.ai', lat: 'lat.peaha.ai', br: 'br.peaha.ai' }

// utm_source on outbound links (app/utils/withUtm.js): the package scope, e.g. "@ara-peaha-ai/web" -> "ara-peaha-ai"
const utmSource = JSON.parse(readFileSync(resolve('package.json'), 'utf8')).name.replace(/^@/, '').split('/')[0]

export default defineNuxtConfig({
  hooks: {
    // Content reaches D1 from the deploy workflows (scripts/d1-content-sql.mjs), so the
    // worker must not import on a first request: under Workers limits that import can
    // stop halfway and leave `ready = 0`, hanging every content route (2026-09-30).
    // @nuxt/content makes the same choice for NuxtHub. Runs after the module's
    // modules:done, which hardcodes integrityCheck: true.
    'nitro:config': (nitroConfig) => {
      if (nitroConfig.dev) return
      nitroConfig.runtimeConfig.content ||= {}
      nitroConfig.runtimeConfig.content.integrityCheck = false
    }
  },
  runtimeConfig: {
    public: { socials, utmSource, ownHosts: Object.values(localeDomains) }
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
      ],
      script: [
        // ponytail: Umami tracking disabled temporarily, re-enable when stats matter again
        // {
        //   src: 'https://992261076.peaha.ai/992261076.js',
        //   defer: true,
        //   'data-website-id': 'fcbcc77a-a940-4fec-9eb2-7923910ffa07',
        //   'data-domains': 'int.peaha.ai, lat.peaha.ai, br.peaha.ai'
        // }
      ]
    }
  },

  nitro: {
    preset: 'cloudflare-pages'
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/i18n'
  ],

  ui: {
    experimental: {
      componentDetection: true
    }
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  // ponytail: dev-only single-locale mode (NUXT_ENABLE_SOVEREIGN_PREVIEW=true, see
  // `npm run dev:content`) to preview sovereign/content/original at the bare root path —
  // no_prefix + one locale means `/` renders it directly, no dedicated path needed.
  // Never active in production; fully separate from the real int/lat/br i18n config below.
  ...(process.env.NUXT_ENABLE_SOVEREIGN_PREVIEW === 'true'
    ? {
      i18n: {
        inject: true,
        strategy: 'no_prefix',
        defaultLocale: 'original',
        detectBrowserLanguage: false,
        locales: [{ code: 'original', name: 'Original (dev preview)', language: 'it-PY', file: 'int.json', dir: 'ltr' }]
      }
    }
    : {
      i18n: {
        inject: true,
        strategy: process.env.NUXT_PUBLIC_IS_PREVIEW === 'true' ? 'prefix' : 'no_prefix',
        differentDomains: process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true',
        defaultLocale: 'lat',
        detectBrowserLanguage: false,
        customRoutes: 'config',
        locales: [{
          code: 'int',
          name: 'English',
          language: 'en-US',
          file: 'int.json',
          dir: 'ltr',
          ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
            domain: process.env.NODE_ENV === 'production' ? localeDomains.int : 'int.peaha.local:3000'
          })
        },
        {
          code: 'lat',
          name: 'Castellano',
          language: 'es-419',
          file: 'lat.json',
          dir: 'ltr',
          ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
            domain: process.env.NODE_ENV === 'production' ? localeDomains.lat : 'lat.peaha.local:3000'
          })
        },
        {
          code: 'br',
          name: 'Português',
          language: 'pt-BR',
          file: 'br.json',
          dir: 'ltr',
          ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
            domain: process.env.NODE_ENV === 'production' ? localeDomains.br : 'br.peaha.local:3000'
          })
        }]
      }
    }),

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB'
    },
    // `##todo … todo##` and any other `##<name> … <name>##` command → its content component
    build: {
      markdown: {
        remarkPlugins: { [resolve('remark-commands.mjs')]: {} }
      }
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    server: {
      allowedHosts: ['int.peaha.local', 'lat.peaha.local', 'br.peaha.local']
    }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
