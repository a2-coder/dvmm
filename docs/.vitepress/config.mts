import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DVMM",
  lastUpdated: true,
  cleanUrls: true,
  description: "Frontend architecture pattern for clean separation of backend and UI models using mappers.",
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin(),
      llmstxt({ workDir: '.', ignoreFiles: ['index.md'] }) as any
    ],
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/logo.svg', width: 24, height: 24 },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Whitepaper', link: 'https://doi.org/10.5281/zenodo.15671574', target: '_blank' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is DVMM', link: '/what-is-dvmm' },
          { text: 'Getting Started', link: '/getting-started' }
        ]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Todo List', link: '/examples/todo-list' },
          { text: 'User Management', link: '/examples/user-management' },
          { text: 'Blog', link: '/examples/blog' },
          { text: 'E-Commerce', link: '/examples/ecommerce' },
          { text: 'Messaging', link: '/examples/messaging' },
          { text: 'Project Management', link: '/examples/project-management' }
        ]
      },
      {
        text: 'Extras',
        items: [
          { text: 'LLM Instructions', link: '/llms-full.txt' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/a2-coder/dvmm' }
    ],
  }
})
