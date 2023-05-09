<template>
  <div class="tag-list">
    <slot />
  </div>
</template>

<script setup>
const $props = defineProps({
  tag: {
    type: Array,
    default: [],
  }
})

const { tag: p_tag } = toRefs($props)
</script>

<style lang="scss" scoped>
.tag-list {
  display: flex;
  flex-direction: column;
}
</style>