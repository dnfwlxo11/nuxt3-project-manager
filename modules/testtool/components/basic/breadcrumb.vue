<template>
  <div class="breadcrumb">
    <div class="step" v-for="(step, idx) of p_items" :key="idx">
      <span :class="{ last: idx === p_items.length - 1 }">{{ step.charAt(0).toUpperCase() + step.slice(1) }}</span>
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
  justify-content: center;
  align-items: center;
  height: 24px;
  padding: 5px 10px;
  background-color: #F8F9FB;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.1);
  border-radius: 27px;


  .step {
    color: #D2D5DA;

  }

  .last {
    color: #7E8695;
  }
}
</style>