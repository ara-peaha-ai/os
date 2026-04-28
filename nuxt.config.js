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
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  i18n: {
    inject: true,
    strategy: 'no_prefix',
    differentDomains: true,
    defaultLocale: 'es',
    detectBrowserLanguage: false,
    locales: [{
      code: 'en',
      name: 'English',
      language: 'en-US',
      file: 'en.json',
      dir: 'ltr',
      domain: process.env.NODE_ENV === 'production' ? 'p2payments.com' : 'en.p2pagos.local:3000'
    },
    {
      code: 'es',
      name: 'Español',
      language: 'es-ES',
      file: 'es.json',
      dir: 'ltr',
      domain: process.env.NODE_ENV === 'production' ? 'p2pagos.com' : 'es.p2pagos.local:3000'
    },
    {
      code: 'pt',
      name: 'Português',
      language: 'pt-BR',
      file: 'pt.json',
      dir: 'ltr',
      domain: process.env.NODE_ENV === 'production' ? 'p2pagamentos.com.br' : 'pt.p2pagos.local:3000'
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
