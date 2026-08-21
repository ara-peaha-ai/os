export default defineNuxtConfig({
  runtimeConfig: {
    wiseApiToken: process.env.NUXT_WISE_API_TOKEN
  },

  app: {
    head: {
      script: [
        {
          src: 'https://992261076.p2pagos.com/992261076.js',
          defer: true,
          'data-website-id': 'fcbcc77a-a940-4fec-9eb2-7923910ffa07',
          'data-domains': 'en.paguaitu.com, es.paguaitu.com, pt.paguaitu.com'
        }
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

  i18n: {
    inject: true,
    strategy: process.env.NUXT_PUBLIC_IS_PREVIEW === 'true' ? 'prefix_except_default' : 'no_prefix',
    differentDomains: process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true',
    defaultLocale: 'es',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      'py-2-latam': {
        en: '/py-2-latam',
        es: '/py-2-latam',
        pt: '/py-2-latam',
      },
      'coin-2-property': {
        en: '/coin-2-property',
        es: '/coin-2-property',
        pt: '/coin-2-property',
      },
      'services/index': {
        en: '/services',
        es: '/servicios',
        pt: '/servicos',
      },
      'services/local-2-coin/index': {
        en: '/services/local-2-coin',
        es: '/servicios/local-2-coin',
        pt: '/servicos/local-2-coin',
      },
      'services/local-2-coin/documentation': {
        en: '/services/local-2-coin/documentation',
        es: '/servicios/local-2-coin/documentation',
        pt: '/servicos/local-2-coin/documentation',
      },
      'services/coin-2-local/index': {
        en: '/services/coin-2-local',
        es: '/servicios/coin-2-local',
        pt: '/servicos/coin-2-local',
      },
      'services/coin-2-local/real-estate/paraguay': {
        en: '/services/coin-2-local/real-estate/paraguay',
        es: '/servicios/coin-2-local/bienes-raices/paraguay',
        pt: '/servicos/coin-2-local/imoveis/paraguai',
      },
      'services/coin-2-local/real-estate/panama': {
        en: '/services/coin-2-local/real-estate/panama',
        es: '/servicios/coin-2-local/bienes-raices/panama',
        pt: '/servicos/coin-2-local/imoveis/panama',
      },
      'services/coin-2-local/expat-remittance/index': {
        en: '/services/coin-2-local/expat-remittance',
        es: '/servicios/coin-2-local/remesas-expat',
        pt: '/servicos/coin-2-local/remessas-expat',
      },
      'services/mono-2-multi/index': {
        en: '/services/mono-2-multi',
        es: '/servicios/mono-2-multi',
        pt: '/servicos/mono-2-multi',
      },
      'services/mono-2-multi/latam-2-int': {
        en: '/services/mono-2-multi/latam-2-int',
        es: '/servicios/mono-2-multi/latam-2-int',
        pt: '/servicos/mono-2-multi/latam-2-int',
      },
      'services/mono-2-multi/int-2-latam/index': {
        en: '/services/mono-2-multi/int-2-latam',
        es: '/servicios/mono-2-multi/int-2-latam',
        pt: '/servicos/mono-2-multi/int-2-latam',
      },
      'services/mono-2-multi/int-2-latam/paraguay': {
        en: '/services/mono-2-multi/int-2-latam/paraguay',
        es: '/servicios/mono-2-multi/int-2-latam/paraguay',
        pt: '/servicos/mono-2-multi/int-2-latam/paraguai',
      },
      'services/mono-2-multi/int-2-latam/suriname': {
        en: '/services/mono-2-multi/int-2-latam/suriname',
        es: '/servicios/mono-2-multi/int-2-latam/surinam',
        pt: '/servicos/mono-2-multi/int-2-latam/suriname',
      },
      'insights/index': {
        en: '/insights',
        es: '/perspectivas',
        pt: '/perspectivas',
      },
    },
    locales: [{
      code: 'en',
      name: 'English',
      language: 'en-US',
      file: 'en.json',
      dir: 'ltr',
      ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
        domain: process.env.NODE_ENV === 'production' ? 'en.paguaitu.com' : 'en.p2pagos.local:3000'
      })
    },
    {
      code: 'es',
      name: 'Español',
      language: 'es-419',
      file: 'es.json',
      dir: 'ltr',
      ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
        domain: process.env.NODE_ENV === 'production' ? 'es.paguaitu.com' : 'es.p2pagos.local:3000'
      })
    },
    {
      code: 'pt',
      name: 'Português',
      language: 'pt-BR',
      file: 'pt.json',
      dir: 'ltr',
      ...(process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true' && {
        domain: process.env.NODE_ENV === 'production' ? 'pt.paguaitu.com' : 'pt.p2pagos.local:3000'
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
