<template>
  <button class="button">{{ p_name }}</button>
</template>

<script setup>
const $props = defineProps({
  name: {
    type: String,
    default: '새 버튼'
  }
})

const { name: p_name } = toRefs($props)
</script>

<style lang="scss">
.button {
  padding: 5px;
  border: 1px solid lightgrey;
  border-radius: 0.25rem;
  background-color: #E8DDEE;

  &:hover {
    cursor: pointer;
  }
}
</style>

