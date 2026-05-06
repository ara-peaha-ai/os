export default defineNuxtConfig({
  runtimeConfig: {
    wiseApiToken: process.env.NUXT_WISE_API_TOKEN
  },

  nitro: {
    preset: 'cloudflare-pages'
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
    strategy: process.env.NUXT_PUBLIC_IS_PREVIEW === 'true' ? 'prefix_except_default' : 'no_prefix',
    differentDomains: process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true',
    defaultLocale: 'es',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      'real-estate-in-paraguay': {
        en: '/real-estate-in-paraguay',
        es: '/bienes-raices-en-paraguay',
        pt: '/imoveis-no-paraguai',
        nl: '/real-estate-in-paraguay'
      },
      'py-2-latam': {
        en: '/py-2-latam',
        es: '/py-2-latam',
        pt: '/py-2-latam',
        nl: '/py-2-latam'
      },
      'coin-2-property': {
        en: '/coin-2-property',
        es: '/coin-2-property',
        pt: '/coin-2-property',
        nl: '/coin-2-property'
      },
      'services/index': {
        en: '/services',
        es: '/servicios',
        pt: '/servicos',
        nl: '/diensten'
      },
      'services/local-2-coin/index': {
        en: '/services/local-2-coin',
        es: '/servicios/local-2-coin',
        pt: '/servicos/local-2-coin',
        nl: '/diensten/local-2-coin'
      },
      'services/local-2-coin/documentation': {
        en: '/services/local-2-coin/documentation',
        es: '/servicios/local-2-coin/documentation',
        pt: '/servicos/local-2-coin/documentation',
        nl: '/diensten/local-2-coin/documentation'
      },
      'services/coin-2-local/index': {
        en: '/services/coin-2-local',
        es: '/servicios/coin-2-local',
        pt: '/servicos/coin-2-local',
        nl: '/diensten/coin-2-local'
      },
      'services/coin-2-local/paraguay': {
        en: '/services/coin-2-local/paraguay',
        es: '/servicios/coin-2-local/paraguay',
        pt: '/servicos/coin-2-local/paraguai',
        nl: '/diensten/coin-2-local/paraguay'
      },
      'services/coin-2-local/panama': {
        en: '/services/coin-2-local/panama',
        es: '/servicios/coin-2-local/panama',
        pt: '/servicos/coin-2-local/panama',
        nl: '/diensten/coin-2-local/panama'
      },
      'services/mono-2-multi/index': {
        en: '/services/mono-2-multi',
        es: '/servicios/mono-2-multi',
        pt: '/servicos/mono-2-multi',
        nl: '/diensten/mono-2-multi'
      },
      'services/mono-2-multi/latam-2-int': {
        en: '/services/mono-2-multi/latam-2-int',
        es: '/servicios/mono-2-multi/latam-2-int',
        pt: '/servicos/mono-2-multi/latam-2-int',
        nl: '/diensten/mono-2-multi/latam-2-int'
      },
      'services/mono-2-multi/int-2-latam/index': {
        en: '/services/mono-2-multi/int-2-latam',
        es: '/servicios/mono-2-multi/int-2-latam',
        pt: '/servicos/mono-2-multi/int-2-latam',
        nl: '/diensten/mono-2-multi/int-2-latam'
      },
      'services/mono-2-multi/int-2-latam/paraguay': {
        en: '/services/mono-2-multi/int-2-latam/paraguay',
        es: '/servicios/mono-2-multi/int-2-latam/paraguay',
        pt: '/servicos/mono-2-multi/int-2-latam/paraguai',
        nl: '/diensten/mono-2-multi/int-2-latam/paraguay'
      },
      'services/mono-2-multi/int-2-latam/suriname': {
        en: '/services/mono-2-multi/int-2-latam/suriname',
        es: '/servicios/mono-2-multi/int-2-latam/surinam',
        pt: '/servicos/mono-2-multi/int-2-latam/suriname',
        nl: '/diensten/mono-2-multi/int-2-latam/suriname'
      },
    },
    locales: [{
      code: 'en',
      name: 'English',
      language: 'en-US',
      file: 'en.json',
      dir: 'ltr',
      ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
        domain: process.env.NODE_ENV === 'production' ? 'www.p2payments.com' : 'en.p2pagos.local:3000'
      })
    },
    {
      code: 'es',
      name: 'Español',
      language: 'es-ES',
      file: 'es.json',
      dir: 'ltr',
      ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
        domain: process.env.NODE_ENV === 'production' ? 'www.p2pagos.com' : 'es.p2pagos.local:3000'
      })
    },
    {
      code: 'pt',
      name: 'Português',
      language: 'pt-BR',
      file: 'pt.json',
      dir: 'ltr',
      ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
        domain: process.env.NODE_ENV === 'production' ? 'www.p2pagamentos.com.br' : 'pt.p2pagos.local:3000'
      })
    },
    {
      code: 'nl',
      name: 'Nederlands',
      language: 'nl-SR',
      file: 'nl.json',
      dir: 'ltr',
      ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
        domain: process.env.NODE_ENV === 'production' ? 'www.p2paysa.sr' : 'nl.p2pagos.local:3000'
      })
    }]
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB'
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    server: {
      allowedHosts: ['en.p2pagos.local', 'es.p2pagos.local', 'pt.p2pagos.local', 'nl.p2pagos.local']
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
