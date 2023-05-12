<template>
  <div :style="`margin: ${p_space}px 0;`"></div>
</template>

<script setup>
const $props = defineProps({
  space: {
    type: Number,
    default: 0,
  }
})

const { space: p_space } = toRefs($props)
</script>