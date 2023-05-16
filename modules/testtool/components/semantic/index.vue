<template>
   <TestLayout ref="layout">
    <HorizResizeComponent>
      <template #leftSide>
        <LeftMenu :components="_components" :imports="_imports" />
      </template>
      <template #rightSide>
        <RightMenu :fileData="_fileData" />
      </template>
    </HorizResizeComponent>
  </TestLayout>
</template>

<script setup>
import SemanticPage from '@/modules/testtool/components/semantic/index.vue'
import TestLayout from '@/modules/testtool/components/compound/layout/default.vue'
import LeftMenu from '@/modules/testtool/components/basic/menus/leftMenu.vue'
import RightMenu from '@/modules/testtool/components/basic/menus/rightMenu.vue'
import HorizResizeComponent from '@/modules/testtool/components/compound/horizResizeComponent.vue'

import { io } from 'socket.io-client'

const $props = defineProps({
  test: {
    type: String,
    default: 'test',
  }
})

const currentComponentRef = ref()
const _socket = ref()

const _componentsBasePath = ref()
const _importsBasePath = ref()
const _utilsBasePath = ref()

const _componentsTree = useState('componentsTree', () => { return [] })
const _composablesTree = useState('composablesTree', () => { return [] })
const _utilsTree = useState('utilsTree', () => { return [] })
const _importsTree = useState('importsTree', () => { return [] })

const _components = ref([])
const _composables = ref([])
const _utils = ref([])
const _plugins = ref([])
const _imports = ref([])

const leftSide = ref()
const rightSide = ref()

const _selectMenu = ref('props')

const _fileData = ref()
const _propsData = ref()
const _storyPropsData = ref({})
const _componentData = ref()
const _stateData = ref()

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

const c_currentComponent = computed(() => {
  const path = params.path ? params.path.slice(1).reduce((acc, item) => {
    if (!item.includes('index')) acc += item.charAt(0).toUpperCase() + item.split('.')[0].slice(1)
    return acc
  }, '') : ''

  return path
})

const { params } = useRoute()

onMounted(() => {
  _socket.value = io('http://localhost:11000')
  // _socket.value = io('http://192.168.123.187:11000')

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
    // console.log('update components', data)
  })

  _socket.value.on('update:imports', (data) => {
    // console.log('update imports', data)
  })
})

onBeforeUnmount(() => {
  _socket.value.close()
})

const f_getPropsData = (props) => {
  const propsData = {}
  Object.entries(props[0]).forEach(([key, data]) => propsData[key] = data['default'])
  return propsData
}
watch(currentComponentRef, (newVal) => {
  nextTick(() => {
    currentComponentRef.value = newVal
    _propsData.value = currentComponentRef.value?.$?.propsOptions || null
    _storyPropsData.value = f_getPropsData(_propsData.value)
    _componentData.value = currentComponentRef.value?.$?.data || null
    _stateData.value = currentComponentRef.value?.$?.setupState || null
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
.resizeBar {
  height: 100%;
  width: 2px;
  border: 1px solid inherit;
  &:hover {
    cursor: ew-resize;
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