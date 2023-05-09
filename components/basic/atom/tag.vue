<template>
  <div class="tag" :class="`color-${p_color ? p_color : bgColor}`">
    {{ p_tag }}
    <div v-if="p_icon" class="icon">
      <img :src="`/assets/icons/${p_icon}.svg`">
    </div>
    <slot />
  </div>
</template>

<script setup>
const $props = defineProps({
  tag: {
    type: String,
    required: true,
    default: '새 태그',
  },
  color: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
})

const { tag: p_tag, color: p_color, icon: p_icon, state: p_state } = toRefs($props)
const bgColor = ref(null)

const f_setRandomColor = () => {
  if (p_color.value) return

  bgColor.value = parseInt((Math.random() * 10) + 1)
}

onMounted(() => {
  f_setRandomColor()
})
</script>

<style lang="scss" scoped>
.tag {
  text-align: center;
  display: inline-flex;
  padding: 6px;
  margin: 3px;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
  }

  & .icon {
    margin: 0 2px;
    display: flex;
    align-items: center;

    & img {
      height: 16px;
    }
  }
}
</style>