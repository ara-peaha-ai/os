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
    customRoutes: 'config',
    pages: {
      'services/index': {
        en: '/services',
        es: '/servicios',
        pt: '/servicos'
      },
      'services/fiat-2-chain': {
        en: '/services/fiat-2-chain',
        es: '/servicios/fiat-2-chain',
        pt: '/servicos/fiat-2-chain'
      },
      'services/chain-2-fiat/index': {
        en: '/services/chain-2-fiat',
        es: '/servicios/chain-2-fiat',
        pt: '/servicos/chain-2-fiat'
      },
      'services/chain-2-fiat/paraguay': {
        en: '/services/chain-2-fiat/paraguay',
        es: '/servicios/chain-2-fiat/paraguay',
        pt: '/servicos/chain-2-fiat/paraguai'
      },
      'services/eas-2-us': {
        en: '/services/eas-2-us',
        es: '/servicios/eas-2-us',
        pt: '/servicos/eas-2-us'
      },
      'services/llc-2-py': {
        en: '/services/llc-2-py',
        es: '/servicios/llc-2-py',
        pt: '/servicos/llc-2-py'
      },
      'bitcoin-stablecoins-local-fiat-settlement/index': {
        en: '/bitcoin-stablecoins-local-fiat-settlement',
        es: '/liquidacion-fiat-local-bitcoin-stablecoins',
        pt: '/liquidacao-fiat-local-bitcoin-stablecoins'
      },
      'bitcoin-stablecoins-local-fiat-settlement/paraguay': {
        en: '/bitcoin-stablecoins-local-fiat-settlement/paraguay',
        es: '/liquidacion-fiat-local-bitcoin-stablecoins/paraguay',
        pt: '/liquidacao-fiat-local-bitcoin-stablecoins/paraguai'
      },
      'multi-rails-consultancy': {
        en: '/multi-rails-consultancy',
        es: '/consultoria-multi-canales',
        pt: '/consultoria-multi-canais'
      }
    },
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

  vite: {
    server: {
      allowedHosts: ['en.p2pagos.local', 'es.p2pagos.local', 'pt.p2pagos.local']
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
