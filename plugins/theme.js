export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.mixin({
    data() {
      return {
        __theme: this.$props.theme || inject('theme', ref('light'))
      }
    },
    computed: {
      c__theme() {
        return this.__theme
      },
      c__color() {
        return defineTheme(this.__theme).current
      },
      c__themes() {
        return defineThemes()
      }
    }
  })
})