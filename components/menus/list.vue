<template>
  <div class="list">
    <slot name="default" />
  </div>
</template>

<script setup>
const $props = defineProps({
  items: {
    type: Object || Array,
  },
})

const { items: p_items } = toRefs($props)
</script>