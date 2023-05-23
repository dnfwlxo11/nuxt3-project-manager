// https://nuxt.com/docs/api/configuration/nuxt-config\
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css' },
      ],
      script: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js'},
      ],
    },
  },
  components: {
    global: true,
    dirs: ['@/components'],
  },
})
