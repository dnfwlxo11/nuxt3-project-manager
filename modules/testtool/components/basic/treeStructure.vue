<template>
  <div v-if="_rootName">
    <div class="root" @click="_isExpand = !_isExpand">
      <div class="icon">
        <img src="/assets/icons/directory.svg" alt="">
      </div>
      <div class="content">
        {{ _rootName }}
      </div>
      <div class="folding">
        <img :src="`/assets/icons/${_isExpand ? 'upper' : 'down'}-chevron.svg`" alt="">
      </div>
    </div>
    <div class="item" v-if="_isExpand">
      <div v-for="(item, idx) of _items" :key="idx" class="menu" @click="$router.push(`/test/${item.projectPath}`)">
        <div class="icon">
          <img src="/assets/icons/bullet.svg" alt="">
        </div>
        <div class="content">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-if="_childes && _isExpand">
      <div v-for="(child, idx) of _childes" :key="idx">
        <tree-structure class="tree-structure" :menus="child" :depth="p_depth + 1" />
      </div>
    </div>
  </div>
</template>

<script setup>
import treeStructure from '@/modules/testtool/components/basic/treeStructure.vue'

const $props = defineProps({
  menus: {
    type: Object,
    default: () => { return {} }
  },
  depth: {
    type: Number,
    default: 0,
  }
})

const { menus: p_menus, depth: p_depth } = toRefs($props)
const _rootName = ref(null)
const _items = ref(null)
const _childes = ref(null)
const _isExpand = ref(true)
const $router = useRouter()

onMounted(() => {
  _rootName.value = Object.keys(p_menus.value)[0] || null
  _items.value = Object.values(p_menus.value)[0]?.item || null
  _childes.value = Object.values(p_menus.value)[0]?.child || null
})
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  color: #636A79;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 42px;
  padding: 0 20px;
  padding-left: calc(v-bind('p_depth') * 20px + 20px);

  &:hover {
    background-clip: border-box;
    background-color: lightgrey;
  }

  .icon {
    margin: auto 0;
    margin-right: 10px;
    height: 15px;
    width: 15px;
  }

  .content {
    display: flex;
    align-items: center;
    line-height: 22px;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .folding {
    margin: auto 0;
    margin-left: auto;
  }
}

.item {
  color: #636A79;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .menu {
    display: flex;
    line-height: 22px;
    padding-left: calc(v-bind('p_depth') * 20px + 20px);
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 42px;

    &:hover {
      cursor: pointer;
      background-color: lightgrey;
    }

    .icon {
      display: flex;
      align-items: center;
      // 아이콘 간 너비를 더하고 빼고 나눠서 정확히 중간에 오게함
      margin-left: calc((20px - 10px + 8px - 3px) / 2);
      padding-left: 20px;
      padding-right: 10px;
      border-left: 1px solid #D2D5DA;
      height: 100%;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }

  &-folding {}
}
</style>