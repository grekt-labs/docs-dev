import { defineConfig } from 'vitepress'
import { enUSSidebar, enUSNav } from './configs/en-US.js'

export default defineConfig({
  title: "grekt | Developer Docs",
  description: "cli-engine developer documentation - interfaces, modules, schemas, and integration patterns",

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],

  locales: {
    'en-US': {
      label: 'English',
      lang: 'en-US',
      link: '/'
    }
  },

  themeConfig: {
    outline: [2, 3],
    siteTitle: false,
    logo: {
      light: '/grekt-logo-light.svg',
      dark: '/grekt-logo-dark.svg'
    },
    nav: [
      ...enUSNav,
      { text: 'GitHub', link: 'https://github.com/grekt-labs' }
    ],

    sidebar: enUSSidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/grekt-labs' }
    ]
  }
})
