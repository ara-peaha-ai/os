export default defineNuxtConfig({
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

  i18n: {
    inject: true,
    strategy: process.env.NUXT_PUBLIC_IS_PREVIEW === 'true' ? 'prefix' : 'no_prefix',
    differentDomains: process.env.NUXT_PUBLIC_IS_PREVIEW !== 'true',
    defaultLocale: 'lat',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      'py-2-latam': {
        int: '/py-2-latam',
        lat: '/py-2-latam',
        br: '/py-2-latam',
      },
      'coin-2-property': {
        int: '/coin-2-property',
        lat: '/coin-2-property',
        br: '/coin-2-property',
      },
      'services/index': {
        int: '/services',
        lat: '/servicios',
        br: '/servicos',
      },
      'services/local-2-coin/index': {
        int: '/services/local-2-coin',
        lat: '/servicios/local-2-coin',
        br: '/servicos/local-2-coin',
      },
      'services/local-2-coin/documentation': {
        int: '/services/local-2-coin/documentation',
        lat: '/servicios/local-2-coin/documentation',
        br: '/servicos/local-2-coin/documentation',
      },
      'services/coin-2-local/index': {
        int: '/services/coin-2-local',
        lat: '/servicios/coin-2-local',
        br: '/servicos/coin-2-local',
      },
      'services/coin-2-local/real-estate/paraguay': {
        int: '/services/coin-2-local/real-estate/paraguay',
        lat: '/servicios/coin-2-local/bienes-raices/paraguay',
        br: '/servicos/coin-2-local/imoveis/paraguai',
      },
      'services/coin-2-local/real-estate/panama': {
        int: '/services/coin-2-local/real-estate/panama',
        lat: '/servicios/coin-2-local/bienes-raices/panama',
        br: '/servicos/coin-2-local/imoveis/panama',
      },
      'services/coin-2-local/expat-remittance/index': {
        int: '/services/coin-2-local/expat-remittance',
        lat: '/servicios/coin-2-local/remesas-expat',
        br: '/servicos/coin-2-local/remessas-expat',
      },
      'services/mono-2-multi/index': {
        int: '/services/mono-2-multi',
        lat: '/servicios/mono-2-multi',
        br: '/servicos/mono-2-multi',
      },
      'services/mono-2-multi/latam-2-int': {
        int: '/services/mono-2-multi/latam-2-int',
        lat: '/servicios/mono-2-multi/latam-2-int',
        br: '/servicos/mono-2-multi/latam-2-int',
      },
      'services/mono-2-multi/int-2-latam/index': {
        int: '/services/mono-2-multi/int-2-latam',
        lat: '/servicios/mono-2-multi/int-2-latam',
        br: '/servicos/mono-2-multi/int-2-latam',
      },
      'services/mono-2-multi/int-2-latam/paraguay': {
        int: '/services/mono-2-multi/int-2-latam/paraguay',
        lat: '/servicios/mono-2-multi/int-2-latam/paraguay',
        br: '/servicos/mono-2-multi/int-2-latam/paraguai',
      },
      'services/mono-2-multi/int-2-latam/suriname': {
        int: '/services/mono-2-multi/int-2-latam/suriname',
        lat: '/servicios/mono-2-multi/int-2-latam/surinam',
        br: '/servicos/mono-2-multi/int-2-latam/suriname',
      },
      'insights/index': {
        int: '/insights',
        lat: '/perspectivas',
        br: '/perspectivas',
      },
    },
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
