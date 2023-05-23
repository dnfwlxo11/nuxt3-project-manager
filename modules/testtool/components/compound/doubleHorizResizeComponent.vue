<template>
  <div class="resize-component">
    <slot v-if="$slots.leftSide" name="leftSide" />
    <div class="resizeBar" ref="resizeBar"></div>
    <slot v-if="$slots.rightSide" name="rightSide" />
  </div>
</template>

<script setup>
const $props = defineProps({
  minWidth: {
    type: Number,
    default: 200,
  }
})
const { minWidth: p_minWidth } = toRefs($props)
const resizeBar = ref()
const leftSide = ref()
const rightSide = ref()
const leftWidth = ref()
const parentWidth = ref()
const minPercentage = ref()
const posX = ref()
const posY = ref()
const h_mouseMoveHandler = (evt) => {
  const dx = evt.clientX - posX.value

  document.body.style.userSelect = "none"
  document.body.style.pointerEvents = "none"

  const newWidth = ((leftWidth.value + dx) * 100) / parentWidth.value
  
  leftSide.value.style.width = `${newWidth < minPercentage.value ? minPercentage.value : newWidth}%`
}
const h_mouseDownHandler = (evt) => {
  leftWidth.value = leftSide.value.getBoundingClientRect().width
  parentWidth.value = resizeBar.value.parentNode.getBoundingClientRect().width
  minPercentage.value = (p_minWidth.value / parentWidth.value) * 100

  posX.value = evt.clientX
  posY.value = evt.clientY

  document.addEventListener('mousemove', h_mouseMoveHandler)
  document.addEventListener('mouseup', h_mouseUpHandler)
}
const h_mouseUpHandler = (evt) => {
  parentWidth.value = resizeBar.value.parentNode.getBoundingClientRect().width

  document.body.style.userSelect = "initial"
  document.body.style.pointerEvents = "initial"

  document.removeEventListener('mousemove', h_mouseMoveHandler)
  document.removeEventListener('mouseup', h_mouseUpHandler)
}

onMounted(() => {
  resizeBar.value.addEventListener('mousedown', h_mouseDownHandler)
  
  parentWidth.value = resizeBar.value.parentNode.clientWidth
  leftSide.value = resizeBar.value.previousElementSibling
  rightSide.value = resizeBar.value.nextElementSibling
})

onBeforeMount(() => {
  // resizeBar.value.removeEventListener('mousedown', h_mouseDownHandler)
  document.removeEventListener('mouseup', h_mouseUpHandler)
  document.removeEventListener('mousedown', h_mouseDownHandler)
  document.removeEventListener('mousemove', h_mouseMoveHandler)
})
</script>
  
<style lang="scss" scoped>
.resize-component {
  display: flex;
  width: 100%;

  .resizeBar {
    height: 100%;
    border: 1px solid inherit;

    &:hover {
      cursor: ew-resize;
    }
  }
}
</style>