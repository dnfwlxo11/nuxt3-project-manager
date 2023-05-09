<template>
  <div v-if="_rootName">
    <strong>📁 {{ _rootName }}</strong>
    <div v-for="(item, idx) of _items" :key="idx">
      <div class="menu" style="border-left: 4px solid lightgrey;padding-left:10px"
        @click="$router.push(`/test/${item.projectPath}`)">
        📄<span>{{ item.name }}
          <!-- (<small><span>{{ item.path }}</span></small>) -->
        </span>
      </div>
    </div>
    <div v-if="_childes">
      <div v-for="(child, idx) of _childes" :key="idx">
        <side-menus class="side-menus" :menus="child" />
      </div>
    </div>
  </div>
</template>

<script setup>
import sideMenus from '@/modules/testtool/sideMenus.vue'

const $props = defineProps({
  menus: {
    type: Object,
    default: () => { return {} }
  }
})

const { menus: p_menus } = toRefs($props)
const _rootName = ref(null)
const _items = ref(null)
const _childes = ref(null)
const $router = useRouter()

onMounted(() => {
  _rootName.value = Object.keys(p_menus.value)[0] || null
  _items.value = Object.values(p_menus.value)[0]?.item || null
  _childes.value = Object.values(p_menus.value)[0]?.child || null
})
</script>

<style lang="scss" scoped>
.side-menus {
  margin: 0 0 10px 20px;

  .menu {
    :hover {
      cursor: pointer;
    }
  }

  &-folding {}
}
</style>