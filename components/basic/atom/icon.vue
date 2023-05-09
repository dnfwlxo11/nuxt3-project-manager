<template>
  <div class="icon">
    <img :src="`/assets/icons/${p_icon}.svg`" />
  </div>
</template>

<script setup>
const $props = defineProps({
  icon: {
    type: String,
    required: true,
    default: 'close'
  }
})

const { icon: p_icon } = toRefs($props)
</script>

<style lang="scss" scoped>
.icon {
  margin: auto 0 auto auto;
  display: flex;
  align-items: center;

  & img {
    height: 16px;
  }
}
</style>