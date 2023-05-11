<template>
  <div>
    sample-test-index
  </div>
</template>

<script setup>

const $props = defineProps({
  test: {
    type: String,
    default: 'a'
  },
  test2: {
    type: String,
    default: 'a',
    test: {
      a: 1,
    }
  },
})
</script>