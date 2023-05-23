<template>
  <div v-if="Object.keys(menus)[0]">
    <div class="root" @click="_isExpand = !_isExpand">
      <div class="icon">
        <img src="/assets/icons/directory.svg" alt="">
      </div>
      <div class="content">
        {{ Object.keys(menus)[0] }}
      </div>
      <div class="folding">
        <img :src="`/assets/icons/${_isExpand ? 'upper' : 'down'}-chevron.svg`" alt="">
      </div>
    </div>
    <div class="item" v-if="_isExpand">
      <div v-for="(item, idx) of Object.values(menus)[0].item" :key="idx" class="menu"
        :class="`${item.related ? 'level-' + item.related : ''}`" @click="$router.push({ path: `/test/${item.projectPath}`, query: _query })">
        <div class="icon">
          <img :src="`/assets/icons/${item.name.split('.').pop() === 'vue' ? 'bullet' : 'bullet'}.svg`">
        </div>
        <div class="content">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div v-if="_childes && _isExpand">
      <div v-for="(child, idx) of Object.values(menus)[0].child" :key="idx">
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
const _menus = ref()
const _rootName = ref(null)
const _items = ref(null)
const _childes = ref(null)
const _isExpand = ref(true)
const $router = useRouter()
const route = useRoute()
const _query = computed(() => {
  return route.query
})

watch(p_menus, (menus) => {
  _rootName.value = Object.keys(menus)[0] || null
  _items.value = Object.values(menus)[0].item || null
  _childes.value = Object.values(menus)[0].child || null

}, { immediate: true })
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  color: #636A79;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 38px;
  padding: 0 20px;
  padding-left: calc(v-bind('p_depth') * 16px + 16px);

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

  .level-1 {
    background-color: #D0DCFF;
    font-weight: 700;

    &:hover {
      background-color: #D0DCFF;
    }
  }

  .level-2 {
    background-color: rgba(222, 255, 255, 0.8);

    &:hover {
      background-color: rgba(222, 255, 255, 1.0);
    }
  }

  .level-3 {
    background-color: rgba(222, 255, 222, 0.8);

    &:hover {
      background-color: rgba(222, 255, 222, 1.0);
    }
  }

  .menu {
    display: flex;
    line-height: 22px;
    padding-left: calc(v-bind('p_depth') * 16px + 16px);
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
      margin-left: calc((16px - 10px + 8px - 3px) / 2);
      padding: 0 8px;
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