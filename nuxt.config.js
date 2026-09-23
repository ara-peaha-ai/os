import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ponytail: trivial flat "key: value" file, a couple lines of parsing beats a
// YAML dependency. Only present when the sovereign checkout is available (dev
// preview, see content.config.js) — absent in a normal/production build for now.
const socialsPath = resolve(process.env.NUXT_SOVEREIGN_CONTENT_DIR || '../sovereign', 'content/socials.pub.yaml')
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

export default defineNuxtConfig({
  runtimeConfig: {
    public: { socials }
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
            domain: process.env.NODE_ENV === 'production' ? 'int.peaha.ai' : 'int.peaha.local:3000'
          })
        },
        {
          code: 'lat',
          name: 'Castellano',
          language: 'es-419',
          file: 'lat.json',
          dir: 'ltr',
          ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
            domain: process.env.NODE_ENV === 'production' ? 'lat.peaha.ai' : 'lat.peaha.local:3000'
          })
        },
        {
          code: 'br',
          name: 'Português',
          language: 'pt-BR',
          file: 'br.json',
          dir: 'ltr',
          ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
            domain: process.env.NODE_ENV === 'production' ? 'br.peaha.ai' : 'br.peaha.local:3000'
          })
        }]
      }
    }),

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB'
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
