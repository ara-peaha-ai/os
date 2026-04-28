export default defineNuxtConfig({
  runtimeConfig: {
    wiseApiToken: process.env.WISE_API_TOKEN
  },

  modules: [
    '@nuxt/eslint',
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
    preference: 'light',
    fallback: 'light',
    storageKey: 'nuxt-color-mode'
  },

  i18n: {
    inject: true,
    strategy: 'prefix',
    defaultLocale: 'en',
    locales: [{
      code: 'en',
      name: 'English',
      language: 'en-US',
      file: 'en.json',
      dir: 'ltr'
    },
    {
      code: 'es',
      name: 'Español',
      language: 'es-ES',
      file: 'es.json',
      dir: 'ltr'
    }]
  },

  content: {
    experimental: {
      nativeSqlite: true
    },
  },

  css: ['~/assets/css/main.css'],

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
