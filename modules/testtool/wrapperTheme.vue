<template>
  <div class="wrapper-theme">
    <slot />
  </div>
</template>

<script setup>
const $props = defineProps({
  theme: {
    type: String,
    default: 'light',
  }
})

const { theme: p_theme } = toRefs($props)

provide('theme', p_theme)
</script>

<style lang="scss" scoped>
.wrapper-theme {
  background-color: white;
}
</style>