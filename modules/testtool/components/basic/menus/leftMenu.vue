<template>
  <div class="left-area">
    <div class="left-first">
      <div class="inner">
        <div class="menu"
          v-for="(item, idx) of ['all', 'components', 'imports', 'global storage', 'design system', 'language database', 'related']"
          :key="idx">
          <div class="icon">
            <img src="/assets/icons/hexagon.svg" alt="">
          </div>
          <div class="tree-title">
            {{ item.charAt(0).toUpperCase() + item.slice(1) }}
          </div>
        </div>
      </div>
    </div>
    <div class="left-second" ref="menuArea">
      <div class="inner">
        <div class="tree-title" @click="_trees[0] = !_trees[0]">COMPONENTS</div>
        <div v-if="_componentsTree" :class="{ 'folding': _trees[0] }">
          <div v-for="(value, key) in _componentsTree" :key="key">
            <div v-if="value">
              <tree-structure v-if="value" :menus="{ [key]: value }" />
            </div>
          </div>
        </div>
        <div v-else>
          <strong>컴포넌트가 존재하지 않습니다.</strong>
        </div>

        <div class="tree-title" @click="_trees[1] = !_trees[1]">IMPORTS</div>
        <div v-if="_importsTree" :class="{ 'folding': _trees[1] }">
          <div v-for="( value, key ) in  _importsTree " :key="key">
            <div v-if="value">
              <tree-structure v-if="value" :menus="{ [key]: value }" />
            </div>
          </div>
        </div>
        <div v-else>
          <strong>구성함수가 존재하지 않습니다.</strong>
        </div>

        <br><br>

        <strong>Plugins</strong>
        <div v-if="_plugins.length">
        </div>
        <div v-else>
          <strong>추가된 플러그인이 없습니다.</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import treeStructure from '@/modules/testtool/components/basic/treeStructure.vue'

const $props = defineProps({
  components: {
    type: Array,
    default: []
  },
  imports: {
    type: Array,
    default: []
  },
  componentsTree: {
    type: Object,
    default: () => { return {} }
  },
  importsTree: {
    type: Object,
    default: () => { return {} }
  },
})

const {
  components: p_components,
  imports: p_imports,
  componentsTree: p_componentsTree,
  importsTree: p_importsTree,
} = toRefs($props)

const _trees = ref([false, false, false])
const _selectMenu = ref('props')

const menuArea = ref()
const resizeBar = ref()
const menuX = ref()
const menuY = ref()
const menuWidth = ref()

const _componentsTree = ref([])
const _composablesTree = ref([])
const _utilsTree = ref([])
const _importsTree = ref([])

const _components = ref([])
const _composables = ref([])
const _utils = ref([])
const _plugins = ref([])
const _imports = ref([])

watch([p_components, p_imports, p_componentsTree, p_importsTree],
  ([components, imports, componentsTree, importsTree]) => {
    _components.value = components
    _imports.value = imports
    _componentsTree.value = componentsTree
    _importsTree.value = importsTree
  }
)
</script>

<style lang="scss" scoped>
.left-area {
  display: flex;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  background-color: #F8F9FB;
  height: 100vh;

  .left-first {
    height: 100%;
    width: 100px;
    min-width: 100px;
    border-right: 1px solid #D2D5DA;

    .inner {
      padding: 40px 0;

      .menu {
        padding: 10px;
        margin-bottom: 20px;

        &:hover {
          cursor: pointer;
        }

        .icon {
          margin: 0 auto;
          margin-bottom: 5px;
          width: 18px;
          height: 18px;
        }

        .tree-title {
          margin: 0 auto;
          text-align: center;
          font-size: 9px;
          color: #636A79;
          line-height: 13.5px;
          font-weight: 500;
        }

        &:hover {
          background-color: lightgrey
        }
      }
    }
  }

  .left-second {
    flex: 1 1 auto;
    min-width: 200px;
    width: 250px;
    padding: 20px;
    border-right: 1px solid #D2D5DA;
    overflow-x: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .inner {
      .tree-title {
        padding: 5px;
        font-weight: 800;
        color: gray;
        letter-spacing: 0.1rem;
        margin: 10px 0;
        color: #32363E;

        &:hover {
          background-color: lightgrey;
        }
      }
    }
  }
}
</style>