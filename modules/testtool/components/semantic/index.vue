<template>
  <TestLayout>
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
            <importCodes :imports="_plugins" />
          </div>
          <div v-else>
            <strong>추가된 플러그인이 없습니다.</strong>
          </div>
        </div>
      </div>
    </div>
    <div class="resizeBar" ref="resizeBar"></div>
    <div v-if="_fileData" class="right-area">
      <div class="preview-area">
        <div v-if="!c_isComponent">
          <div class="code">
            컴포넌트 파일이 아닙니다.
          </div>
        </div>
        <div v-else>
          <div class="preview-component">
            <Component :is="c_currComponent" ref="currComponentRef" />
          </div>
        </div>
        <br><br>
      </div>

    </div>
    <div class="third-area">
      <div class="bottom-menus">
        <div class="horizontal-menu">
          <div class="dynamic-menus">
            <div class="menu" v-for="(item, idx) of ['props', 'state', 'design', 'story', 'code', 'related']"
              @click="_selectMenu = item" :key="idx">
              {{ item.charAt(0).toUpperCase() + item.slice(1) }}
            </div>
          </div>
          <div class="fixed-menus">
            <div class="menu" v-for="(item, idx) of ['설정', '닫기']" :key="idx">
              {{ item }}
            </div>
          </div>
        </div>

        <div class="areas">
          <div class="props-area" v-if="_selectMenu === 'props'">
            <div v-if="!c_isComponent">
              <div>
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else-if="_propsData">
              <pre v-if="_propsData[1].length">{{ f_getPropsData(_propsData) }}</pre>
              <div v-else>{{ '컴포넌트에 props가 없습니다.' }}</div>
            </div>
            <div v-else>
              <pre>{{ '컴포넌트에 props가 없습니다.' }}</pre>
            </div>
          </div>
          <div class="state-area" v-else-if="_selectMenu === 'story'">
            <div v-if="!c_isComponent">
              <div>
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else-if="_propsData">
              <div v-if="_propsData[1].length">
                <Component :is="c_currComponent" :="_storyPropsData" />
                <br>
                <br>

                <strong>구성할 수 있는 스토리</strong>

                <div v-for="( prop, name, idx ) of  _storyPropsData " :key="idx">
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
              <div v-else>{{ '스토리를 구성할 수 없습니다' }}</div>
            </div>
            <div v-else>
              {{ '스토리를 구성할 수 없습니다' }}
            </div>
          </div>
          <div class="design-area" v-else-if="_selectMenu === 'state'">
            <div v-if="!c_isComponent">
              <div>
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else-if="_stateData">
              <pre v-if="Object.keys(_stateData).length">{{ _stateData }}</pre>
              <div v-else>{{ '컴포넌트에 state가 없습니다.' }}</div>
            </div>
            <div v-else>
              {{ '컴포넌트에 state가 없습니다.' }}
            </div>
          </div>
          <div class="story-area" v-else-if="_selectMenu === 'design'">
            <strong>테마들 상세 명세 및 미리보기</strong>
            <div v-if="!c_isComponent">
              <div class="code">
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else>
              <pre class="code">{{ c_allThemes }}</pre>
              <div class="themes">
                <div class="theme-card" v-for="( theme, idx ) of  Object.keys(c_allThemes) " :content="theme" :key="idx">
                  테마: {{ theme }}

                  <Wrapper-theme :theme="theme">
                    <Component :is="c_currComponent" ref="currComponentRef" />
                  </Wrapper-theme>
                </div>
              </div>
            </div>
            <br><br>

            <strong>현재 테마 미리보기</strong>
            <div v-if="!c_isComponent">
              <div class="code">
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else class="code">
              <Wrapper-theme :theme="c__theme">
                <Component :is="c_currComponent" ref="currComponentRef" />
              </Wrapper-theme>
            </div>
            <br><br>

            <strong>현재 적용중인 테마 명세</strong>
            <div v-if="!c_isComponent">
              <div class="code">
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else>
              <pre class="code">{{ c__color }}</pre>
            </div>
          </div>
          <div class="code-area" v-else-if="_selectMenu === 'code'">
            <strong>template</strong>
            <div v-if="!c_isComponent">
              <div class="code">
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else-if="_fileData.templateCode">
              <div v-for="( template, idx ) of  _fileData.templateCode " :key="idx">
                <pre>{{ template }}</pre>
              </div>
            </div>
            <div v-else>
              {{ '작성된 템플릿 코드가 없습니다.' }}
            </div>
            <br><br>

            <strong>script</strong>
            <div v-if="!c_isComponent">
              <div>
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else-if="_fileData.scriptCode">
              <pre v-for="( script, idx ) of  _fileData.scriptCode " :key="idx">{{ script }}</pre>
            </div>
            <div v-else>
              {{ '작성된 스크립트 코드가 없습니다.' }}
            </div>

            <strong>style</strong>
            <div v-if="!c_isComponent">
              <div>
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else-if="_fileData.styleCode">
              <pre v-for="( style, idx ) of  _fileData.styleCode " :key="idx">{{ style }}</pre>
            </div>
            <div v-else>
              {{ '작성된 스타일 코드가 없습니다.' }}
            </div>
          </div>
          <div class="related-area" v-if="_selectMenu === 'related'">
            <strong>related components</strong>
            <div v-if="!c_isComponent">
              <div class="code">
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else-if="_fileData.relativeCode.length">
              <div>{{ _fileData.relativeCode }}</div>
            </div>
            <div v-else>
              {{ '관계된 컴포넌트가 없습니다.' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </TestLayout>
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

const menuArea = ref()
const resizeBar = ref()
const menuX = ref()
const menuY = ref()
const menuWidth = ref()

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
  _socket.value = io('http://192.168.123.187:11000')

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
    console.log(data)
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

  resizeBar.value.addEventListener('mousedown', h_mouseDownHandler)
})

const h_menuResizeHandler = (evt) => {
  const dx = evt.clientX - menuX.value
  const dy = evt.clientY - menuY.value

  // const adjustWidth = ((menuWidth.value + dx) * 100) / resizeBar.value.parentNode.getBoundingClientRect().width
  menuArea.value.style.width = `${menuWidth.value + dx - 40 < 200 ? 200 : menuWidth.value + dx - 40}px`
}

const h_mouseDownHandler = (evt) => {
  menuX.value = evt.clientX
  menuY.value = evt.clientY
  menuWidth.value = menuArea.value.offsetWidth

  menuArea.value.addEventListener('mousemove', h_menuResizeHandler)
  menuArea.value.addEventListener('mouseup', h_mouseUpHandler)
}

const h_mouseUpHandler = (evt) => {
  console.log('mouse leave')

  menuArea.value.removeEventListener('mousemove', h_menuResizeHandler, false)
  menuArea.value.removeEventListener('mouseup', h_mouseUpHandler, false)
}

onBeforeUnmount(() => {
  _socket.value.close()
  resizeBar.value.removeEventListener('mousedown', h_mouseDownHandler, false)
})

const f_getPropsData = (props) => {
  const propsData = {}
  Object.entries(props[0]).forEach(([key, data]) => propsData[key] = data['default'])

  return propsData
}

watch(currComponentRef, (newVal) => {
  nextTick(() => {
    currComponentRef.value = newVal
    _propsData.value = currComponentRef.value?.$?.propsOptions || null
    _storyPropsData.value = f_getPropsData(_propsData.value)
    _componentData.value = currComponentRef.value?.$?.data || null
    _stateData.value = currComponentRef.value?.$?.setupState || null

    console.log(_propsData.value)

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

.resizeBar {
  height: 100%;
  width: 2px;
  border: 1px solid inherit;

  &:hover {
    cursor: ew-resize;
  }
}

.right-area {
  display: flex;
  height: 100vh;
  flex: 1 1 auto;
  flex-direction: column;

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

.third-area {
  background-color: lightblue;
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