<template>
  <div class="test4">
    previewSample-test-test2-test4
    <preview-sample-test2-test4 />
    {{ p_test }}
  </div>
</template>

<script setup>
const $props = defineProps({
  test: {
    type: String,
    default: 'test'
  }
})

const { test: p_test } = toRefs($props)
</script>

<style scoped>
.test4 {
  color: v-bind('c__color.defaultFontColor');
  background-color: v-bind('c__color.defaultBackground');
}
</style>
