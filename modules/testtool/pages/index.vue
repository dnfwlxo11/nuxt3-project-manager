<template>
  <SemanticPage />
</template>

<script setup>
import SemanticPage from '@/modules/testtool/components/semantic/index.vue'

import TestLayout from '@/modules/testtool/components/compound/layout/default.vue'
import treeStructure from '@/modules/testtool/components/basic/treeStructure.vue'
import WrapperTheme from '@/modules/testtool/components/wrapper/wrapperTheme.vue'
import importCodes from '@/modules/testtool/components/basic/importCodes.vue'
import { io } from 'socket.io-client'

const $props = defineProps({
  test: {
    type: String,
    default: 'test',
  }
})

const currComponentRef = ref()
const _socket = ref()

const _componentsBasePath = ref()
const _importsBasePath = ref()
const _utilsBasePath = ref()

const _componentsTree = ref([])
const _composablesTree = ref([])
const _utilsTree = ref([])
const _importsTree = ref([])

const _components = ref()
const _composables = ref([])
const _utils = ref([])
const _plugins = ref([])
const _imports = ref([])

const _trees = ref([false, false, false])
const _selectMenu = ref('props')

const _fileData = ref()
const _propsData = ref()
const _storyPropsData = ref({})
const _componentData = ref()
const _stateData = ref()
const $router = useRouter()

const c_theme = computed(() => {
  return defineTheme()
})
const c_allThemes = computed(() => {
  return defineThemes()
})

const c_isComponent = computed(() => {
  const isFileReg = new RegExp(/\.\w\S+/g)
  const extensions = params.path ? params.path[params.path.length - 1].match(isFileReg) : []

  return extensions[0] === '.vue'
})

const c_currComponent = computed(() => {
  const path = params.path ? params.path.slice(1).reduce((acc, item) => {
    if (!item.includes('index')) acc += item.charAt(0).toUpperCase() + item.split('.')[0].slice(1)
    return acc
  }, '') : ''

  return path
})
const { params } = useRoute()

onMounted(() => {
  // _socket.value = io('http://localhost:11000')
  _socket.value = io('http://localhost:11000')

  _socket.value.on('imports:extend', (data) => {
    _importsBasePath.value = data.basePath
    _importsTree.value = data.tree
    _imports.value = data.imports

    _imports.value.forEach((item, idx) => {
      if (item.directory === 'utils') _utils.value.push(item)
      else if (item.directory === 'plugins') _plugins.value.push(item)
      else _composables.value.push(item)
    })
  })

  _socket.value.on('load:file', (data) => {
    _fileData.value = data
  })

  _socket.value.on('components:extend', (data) => {
    _componentsBasePath.value = data.basePath
    _componentsTree.value = data.tree
    _components.value = data.components

    if (params.path) {
      _socket.value.emit('load:file', `${_componentsBasePath.value}/${params.path.join('/')}`)
    }
  })

  _socket.value.on('update:components', (data) => {
    // $router.go($router.currentRoute)

    console.log('update components', data)
  })

  _socket.value.on('update:imports', (data) => {
    console.log('update imports', data)
  })
})

const f_getPropsData = (props) => {
  const propsData = {}
  Object.entries(props[0]).forEach(([key, data]) => propsData[key] = data['default'])

  return propsData
}

onBeforeUnmount(() => {
  _socket.value.close()
})

watch(currComponentRef, (newVal) => {
  nextTick(() => {
    currComponentRef.value = newVal
    _propsData.value = currComponentRef.value?.$?.propsOptions || null
    _storyPropsData.value = f_getPropsData(_propsData.value)
    _componentData.value = currComponentRef.value?.$?.data || null
    _stateData.value = currComponentRef.value?.$?.setupState || null

    delete _stateData.value['$router']
    delete _stateData.value['listening']
    delete _stateData.value['options']
  })
})
</script>
<style lang="scss" scoped>
.folding {
  display: none;
}

.left-area {
  display: flex;
  height: 100%;

  .left-first {
    height: 100%;
    width: 100px;
    min-width: 100px;
    border-right: 1px solid #D2D5DA;

    .inner {
      padding: 40px 0;

      .menu {
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
      }
    }
  }

  .left-second {
    flex: 1 1 auto;
    min-width: 200px;
    width: 250px;
    padding: 20px 10px 20px 20px;
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
        font-weight: 800;
        color: gray;
        letter-spacing: 0.1rem;
        margin: 10px 0;
        color: #32363E;
      }
    }
  }
}

.right-area {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .preview-area {
    padding: 20px 40px;
    flex: 1 1 auto;
    width: 100%;

    .preview-component {
      display: inline-flex;
      padding: 20px;
      border-radius: 0.25rem;
    }
  }

  .bottom-menus {
    height: 55%;
    position: relative;
    // overflow-y: auto;

    .horizontal-menu {
      position: sticky;
      top: 0;
      height: 20px;
      align-items: center;
      background-color: white;
      border-top: 1px solid #E1E3E5;
      border-bottom: 1px solid #E1E3E5;
      display: flex;
      padding: 15px 0;

      .dynamic-menus {
        display: flex;

        .menu {
          padding: 0 10px;
        }
      }

      .fixed-menus {
        display: flex;
        flex: 1 1 auto;
        justify-content: right;

        .menu {
          padding: 0 10px;
        }
      }
    }

    .areas {
      height: calc(100% - 50px);
      overflow-y: auto;
    }
  }
}



.code {
  background-color: #F1F3F5;
  border-radius: 0.5rem;
  padding: 30px;
}

.themes {
  display: grid;
  border-radius: 0.5rem;
  background-color: #F1F3F5;

  .theme-card {
    margin: 20px;
    padding: 30px;
    border: 1px solid lightgrey;
    border-radius: 0.5rem;

    .theme-component {
      color: v-bind('c__color.defaultFontColor');
      background-color: v-bind('c__color.defaultBackground');
      background-color: v-bind('c__color.defaultBackground');
      background-color: white;
      padding: 20px;
    }
  }
}
</style>