<template>
  <div class="title">{{ p_content }}</div>
</template>

<script setup>
const $props = defineProps({
  content: {
    type: String,
    default: '타이틀 2'
  }
})

const { content: p_content } = toRefs($props)
</script>

<style lang="scss" scoped>
.title {
  color: #1C1E22;
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
  letter-spacing: 0%;
}
</style>