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
        <tree-structure class="tree-structure" :menus="child" />
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
})

const { menus: p_menus } = toRefs($props)
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
.tree-structure {
  padding: 5px 0 5px 20px;
}

.root {
  display: flex;
  color: #636A79;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 3px 5px;

  &:hover {
    background-clip: border-box;
    background-color: lightgrey;
  }

  .icon {
    margin: auto 0;
    height: 15px;
    width: 15px;
  }

  .content {
    padding-left: 10px;
    line-height: 22px;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .folding {
    margin-left: auto;
  }
}

.item {
  padding: 0 5px;
  padding-left: 10px;
  margin-left: 10px;
  border-left: 1px solid #D2D5DA;
  color: #636A79;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .menu {
    display: flex;
    padding: 5px 0;
    line-height: 22px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      cursor: pointer;
      background-clip: border-box;
      background-color: lightgrey;
    }

    .icon {
      padding-left: 5px;
      margin: auto 0;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 10px;
    }
  }

  &-folding {}
}
</style>