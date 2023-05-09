#test
test: 'Hello World' // hihihi
content: 'hihihi'

<template>
  <button>{{ p_content }}</button>
</template>

<script setup>
const $props = defineProps({
  test: {
    type: String,
    default: 'prop test'
  },
  content: {
    type: String,
    default: 'Button'
  }
})

const { content: p_content } = toRefs($props)
</script>