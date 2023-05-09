<template>
  <TestLayout>
    <template #left>
      <strong>Component Tree</strong>
      <div v-if="_componentsTree">
        <div v-for="(value, key) in _componentsTree" :key="key">
          <div v-if="value">
            <tree-structure v-if="value" :menus="{ [key]: value }" />
          </div>
        </div>
      </div>
      <div v-else>
        <strong>컴포넌트가 존재하지 않습니다.</strong>
      </div>
      <br><br>

      <strong>Imports Tree</strong>
      <div v-if="_importsTree">
        <div v-for="(value, key) in _importsTree" :key="key">
          <div v-if="value">
            <tree-structure v-if="value" :menus="{ [key]: value }" />
          </div>
        </div>
      </div>
      <div v-else>
        <strong>구성함수가 존재하지 않습니다.</strong>
      </div>
      <br><br>

      <strong>Imports</strong>
      <div>
        <strong>Composables</strong>
        <div v-if="_composables.length">
          <importCodes :imports="_composables" />
        </div>
        <div v-else>
          <strong>추가된 컴포저블이 없습니다.</strong>
        </div>
        <br><br>

        <strong>Utils</strong>
        <div v-if="_utils.length">
          <importCodes :imports="_utils" />
        </div>
        <div v-else>
          <strong>추가된 유틸리티가 없습니다.</strong>
        </div>
      </div>

      <br><br>

      <strong>Plugins</strong>
      <div v-if="_plugins.length">
        <importCodes :imports="_plugins" />
      </div>
      <div v-else>
        <strong>추가된 플러그인이 없습니다.</strong>
      </div>
    </template>

    <template #right>
      <div v-if="_fileData">
        <strong>컴포넌트 미리보기</strong>
        <div>
          <div class="code">
            <Component :is="_currComponent" ref="currComponentRef" />
          </div>
        </div>
        <br><br>

        <strong>선택된 컴포넌트의 props</strong>
        <div v-if="_propsData">
          <pre class="code" v-if="_propsData[1].length">{{ getPropsData(_propsData) }}</pre>
          <pre class="code" v-else>{{ '컴포넌트에 props가 없습니다.' }}</pre>
        </div>
        <div v-else>
          <pre class="code">{{ '컴포넌트에 props가 없습니다.' }}</pre>
        </div>
        <br><br>

        <strong>컴포넌트 별 스토리보드</strong>
        <div v-if="_propsData">
          <div class="code" v-if="_propsData[1].length">
            <Component :is="_currComponent" :="_storyPropsData" />
            <br>


            <br>

            <strong>구성할 수 있는 스토리</strong>

            <div v-for="(prop, name, idx) of _storyPropsData" :key="idx">
              <br>
              <div>
                <div>이름: {{ name }}</div>
                <div>타입: {{ _propsData[0][name].type.name }}</div>
                <div>기본값: {{ _propsData[0][name].default }}</div>
              </div>

              <div v-if="prop.type === 'Number'">
                <input type="number" v-model="_storyPropsData[name]">
              </div>
              <div v-else-if="prop.type === 'Object'">
                Object 타입의 스토리보드는 아직 지원하지 않습니다.
              </div>
              <div v-else>
                <input type="text" v-model="_storyPropsData[name]">
              </div>
              <br>
            </div>
          </div>
          <div class="code" v-else>{{ '스토리를 구성할 수 없습니다' }}</div>
        </div>
        <div v-else class="code">
          {{ '스토리를 구성할 수 없습니다' }}
        </div>
        <br><br>

        <strong>선택된 컴포넌트의 state</strong>
        <div v-if="_stateData">
          <pre class="code" v-if="Object.keys(_stateData).length">{{ _stateData }}</pre>
          <pre class="code" v-else>{{ '컴포넌트에 state가 없습니다.' }}</pre>
        </div>
        <div v-else class="code">
          {{ '컴포넌트에 state가 없습니다.' }}
        </div>
        <br><br>

        <strong>template</strong>
        <div v-if="_fileData.templateCode">
          <div v-for="(template, idx) of _fileData.templateCode" :key="idx">
            <pre class="code">{{ template }}</pre>
          </div>
        </div>
        <div v-else class="code">
          {{ '작성된 템플릿 코드가 없습니다.' }}
        </div>
        <br><br>

        <strong>script</strong>
        <div v-if="_fileData.scriptCode">
          <pre class="code" v-for="(script, idx) of _fileData.scriptCode" :key="idx">{{ script }}</pre>
        </div>
        <div v-else class="code">
          {{ '작성된 스크립트 코드가 없습니다.' }}
        </div>
        <br><br>

        <strong>style</strong>
        <div v-if="_fileData.styleCode">
          <pre class="code" v-for="(style, idx) of _fileData.styleCode" :key="idx">{{ style }}</pre>
        </div>
        <div v-else class="code">
          {{ '작성된 스타일 코드가 없습니다.' }}
        </div>
        <br><br>

        <strong>related components</strong>
        <div v-if="_fileData.relativeCode.length">

          <div class="code">{{ _fileData.relativeCode }}</div>
        </div>
        <div v-else class="code">
          {{ '관계된 컴포넌트가 없습니다.' }}
        </div>
        <br><br>

        <strong>테마들 상세 명세 및 미리보기</strong>
        <div>
          <pre class="code">{{ c_allThemes }}</pre>
          <div class="themes">
            <div class="theme-card" v-for="(theme, idx) of Object.keys(c_allThemes)" :content="theme" :key="idx">
              테마: {{ theme }}

              <Wrapper-theme :theme="theme">
                <Component :is="_currComponent" ref="currComponentRef" />
              </Wrapper-theme>
            </div>
          </div>
        </div>
        <br><br>

        <strong>현재 테마 미리보기</strong>
        <div class="code">
          <Wrapper-theme :theme="c__theme">
            <Component :is="_currComponent" ref="currComponentRef" />
          </Wrapper-theme>
        </div>
        <br><br>

        <strong>현재 적용중인 테마 명세</strong>
        <div>
          <pre class="code">{{ c__color }}</pre>
        </div>
      </div>
    </template>

  </TestLayout>
</template>

<script setup>
import TestLayout from '@/modules/testtool/layout/default.vue'
import treeStructure from '@/modules/testtool/treeStructure.vue'
import WrapperTheme from '@/modules/testtool/wrapperTheme.vue'
import importCodes from '@/modules/testtool/importCodes.vue'
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
const _currComponent = computed(() => {
  const path = params.path ? params.path.slice(1).reduce((acc, item) => {
    if (item.toLowerCase() !== 'index') acc += item.charAt(0).toUpperCase() + item.slice(1)
    return acc
  }, '') : ''

  return path
})
const { params } = useRoute()

onMounted(() => {
  _socket.value = io('http://localhost:11000')

  _socket.value.on('imports:extend', (data) => {
    _importsBasePath.value = data.basePath
    _importsTree.value = data.tree
    _imports.value = data.imports

    console.log(_importsTree.value)

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

    if (params.path) _socket.value.emit('load:file', `${_componentsBasePath.value}/${params.path.join('/')}.vue`)
  })

  _socket.value.on('update:file', (data) => {
    console.log('update file', data)
  })
})

const getPropsData = (props) => {
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
    _propsData.value = currComponentRef.value.$?.propsOptions || null
    _storyPropsData.value = getPropsData(_propsData.value)
    _componentData.value = currComponentRef.value.$?.data || null
    _stateData.value = currComponentRef.value.$?.setupState || null

    delete _stateData.value['$router']
    delete _stateData.value['listening']
    delete _stateData.value['options']
  })
})
</script>
<style lang="scss" scoped>
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