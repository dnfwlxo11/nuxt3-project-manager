<template>
  <div class="breadcrumb">
    <div class="step" v-for="(step, idx) of p_items" :key="idx">
      <span>{{ step.charAt(0).toUpperCase() + step.slice(1) }}</span>
      <span v-if="idx !== p_items.length - 1">&nbsp;/&nbsp;</span>
    </div>
  </div>
</template>

<script setup>
const $props = defineProps({
  items: {
    type: Array,
    default: []
  }
})

const { items: p_items } = toRefs($props)

const f_createBreadcrumb = () => {
  return p_items.value.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' / ')
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  height: 20px;
  padding: 2px 10px;
  background-color: #F8F9FB;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  max-width: 300px;
  overflow-x: scroll;
  overflow-y: hidden;
  text-overflow: ellipsis;

  &::-webkit-scrollbar {
    display: none;
  }

  .step {
    color: #C1C5CD;

  }

  .step:last-child {
    color: #7E8695;
  }
}
</style>