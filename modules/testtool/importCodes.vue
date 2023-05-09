<template>
  <div>
    <div class="card" v-for="(importExtend, idx) of p_imports" :key="idx">
      <div>임포트명: {{ importExtend.name }}</div>
      <div>임포트폴더: {{ importExtend.directory }}</div>
      <div>추가위치: {{ importExtend.as }}</div>
      <div>프로젝트내위치: {{ importExtend.shortPath }}</div>
      <div>파일위치: {{ importExtend.from }}</div>
    </div>
  </div>
</template>

<script setup>
const $props = defineProps({
  imports: {
    type: Array,
    default: []
  }
})

const { imports: p_imports } = toRefs($props)
</script>

<style lang="scss" scoped>
.card {
  padding: 30px;
  border: 1px solid lightgrey;
}
</style>