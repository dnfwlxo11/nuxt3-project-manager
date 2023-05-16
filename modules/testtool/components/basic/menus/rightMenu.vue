<template>
  <div class="right-menu">
    <div class="right-first">
      <div class="menu-tab">
        <div class="menu" :class="{ 'active': _selectTab === menu }" v-for="(menu, idx) of ['develop', 'design']"
          :key="idx" @click="_selectTab = menu">
          {{ menu.toUpperCase() }}
        </div>
      </div>
      <div class="title">
        Playground
      </div>
    </div>
    <div v-if="_fileData" class="right-second">
      <HorizResizeComponent>
        <template #leftSide>
          <div class="preview-area">
            <div v-if="!c_isComponent">
              <div class="code">
                컴포넌트 파일이 아닙니다.
              </div>
            </div>
            <div v-else>
              <Breadcrumb :items="params.path" />
              <LineSpaceDiv :space="20" />
              <FirstTitle :content="params.path[params.path.length - 1]" />
              <LineSpaceDiv :space="20" />
              <SecondTitle :content="'PREVIEW'" />
              <LineSpaceDiv :space="10" />
              <ComponentViewer :stories="_stories" @update:tab="(tab) => _currentStory = tab" :tab="_currentStory">
                <Component v-show="_currentStory === 'default'" :is="c_currentComponent" ref="currentComponentRef" />
                <div v-for="(item, idx) of _dummy" :key="idx">
                  <Component v-if="_currentStory === _stories[idx + 1]" :is="c_currentComponent"
                    :ref="(el) => _storyComponent.push(el)" :="item" />
                </div>
              </ComponentViewer>
              <LineSpaceDiv :space="30" />
              <SecondTitle :content="'CODE'" />
              <CodeViewer :code="_fileData.templateCode" />
            </div>
          </div>
        </template>
        <template #rightSide>
          <div class="menu-area">
            <div v-if="Object.keys(_storyPropsData).length" class="menu-table">
              <div class="table-title">
                PROPS
              </div>
              <div class="table-content">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, key) in _storyPropsData" :key="key">
                      <td>{{ key }}</td>
                      <td><span class="type-badge">{{ _propsData[0][key].type.name }}</span></td>
                      <td>{{ item }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="menu-table">
              <div class="table-title">
                PROPS
              </div>
              <div class="table-content">
                <table class="table">
                  <thead>
                    <tr>
                      <th colspan="3">Props 데이터가 존재하지 않습니다.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <LineSpaceDiv :space="40" />
            <div v-if="Object.keys(_storyPropsData).length" class="menu-table">
              <div class="table-title">
                STORY
              </div>
              <div class="stories">
                <div class="story" v-for="(dummyItem, idx) of _dummy" :key="idx">
                  <div class="story-menu">
                    <div class="story-badge">
                      #STORY{{ (idx + 1).toString().padStart(2, '0') }}
                    </div>
                    <div class="story-btn">
                      <button @click="f_selectStory(`#STORY${(idx + 1).toString().padStart(2, '0')}`)" :class="{
                        'active': _currentStory === `#STORY${(idx + 1).toString().padStart(2, '0')}`
                      }">
                        <span v-if="_currentStory === `#STORY${(idx + 1).toString().padStart(2, '0')}`">
                          <img src="/assets/icons/done.svg" />
                        </span>
                        <span v-else>
                          적용
                        </span>
                      </button>
                    </div>
                  </div>
                  <div class="table-content">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, key) in dummyItem" :key="key">
                          <td>{{ key }}</td>
                          <td><input type="text" v-model="dummyItem[key]"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <LineSpaceDiv :space="40" />
            <div v-if="_fileData.relativeCode.length" class="menu-table">
              <div class="table-content">
                <div class="table-title">
                  RELATED
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Related Component</th>
                      <th>Deep Related</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in _fileData.relativeCode" :key="idx">
                      <td @click="$router.push(`/test${item.componentPath}`)">{{ item.tagName }}</td>
                      <td v-if="item.related">
                        <div v-for="(deepItem, deepIdx) of item.related" :key="deepIdx">
                          <div v-if="deepItem.related">
                            더 깊은 참조가 있습니다.
                          </div>
                          <div v-else @click="$router.push(`/test${deepItem.componentPath}`)">
                            {{ deepItem.tagName }}
                          </div>
                        </div>
                      </td>
                      <td v-else>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="menu-table">
              <div class="table-content">
                <div class="table-title">
                  RELATED
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th colspan="2">관계된 컴포넌트가 존재하지 않습니다.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <LineSpaceDiv :space="40" />
          </div>
        </template>
      </HorizResizeComponent>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '@/modules/testtool/components/basic/breadcrumb.vue'
import FirstTitle from '@/modules/testtool/components/basic/firstTitle.vue'
import SecondTitle from '@/modules/testtool/components/basic/secondTitle.vue'
import WrapperTheme from '@/modules/testtool/components/wrapper/wrapperTheme.vue'
import LineSpaceDiv from '@/modules/testtool/components/basic/lineSpaceDiv.vue'
import CodeViewer from '@/modules/testtool/components/basic/codeViewer.vue'
import ComponentViewer from '@/modules/testtool/components/compound/componentViewer.vue'
import HorizResizeComponent from '@/modules/testtool/components/compound/horizResizeComponent.vue'

const $props = defineProps({
  fileData: {
    type: Object,
    default: () => { return {} }
  },
})

const { fileData: p_fileData } = toRefs($props)

const _selectMenu = ref('props')
const _selectTab = ref('develop')
const _fileData = ref()
const _propsData = ref()
const _storyPropsData = ref({})
const _componentData = ref()
const _stateData = ref()
const currentComponentRef = ref()
const _stories = ref(['default'])
const _dummy = ref([
  { test: "prop test1", content: "Button1" },
  { test: "prop test2", content: "Button2" },
  { test: "prop test3", content: "Button3" },
])
const _storyComponent = ref([])
const _currentStory = ref('default')
const _componentTree = useState('componentsTree')

const { params } = useRoute()
const $router = useRouter()

const f_getPropsData = (props) => {
  // if (!props) return

  const propsData = {}
  Object.entries(props[0]).forEach(([key, data]) => propsData[key] = data['default'])

  return propsData
}

const f_selectStory = (name) => {
  _currentStory.value = name
}

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

const f_treeCircuit = (target) => {
  Object.entries(target).map(([key, value]) => {
    if (value.item.length) {
      value.item = value.item.map((item, idx) => {
        const currentComponentName = params.path.slice(1).join('').toLowerCase().replace('.vue', '')
        const componentName = item.projectPath.split('/').slice(1).join('').toLowerCase().replace('.vue', '')

        if (currentComponentName === componentName) return {...item, related: 1}
        else return {...item, related: -1}
      })
    }

    if (value.child.length) {
      value.child.map(item => {
        f_treeCircuit(item)
      })
    }
  })

  return target
}

onMounted(() => {
  _dummy.value.map((item, idx) => {
    _stories.value.push(`#STORY${(idx + 1).toString().padStart(2, '0')}`)
  })
})

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

watch(p_fileData, (newVal) => {
  _fileData.value = newVal
  _componentTree.value = f_treeCircuit(_componentTree.value)
})
</script>

<style lang="scss" scoped>
.right-menu {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100vh;
  border-right: 1px solid #D2D5DA;

  .right-first {
    min-height: 70px;
    background-color: #F8F9FB;
    border-bottom: 1px solid #D2D5DA;
    display: flex;

    .menu-tab {
      display: flex;
      align-items: flex-end;

      .menu {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 26px;
        width: 106px;
        font-weight: 600;
        font-size: 16px;
        color: #1C1E22;
        border-bottom: 4px solid transparent;
      }

      .active {
        border-bottom: 4px solid #1C1E22;
      }
    }

    .title {
      color: #A0A5B1;
      font-size: 24px;
      font-weight: 600;
      line-height: 38px;
      letter-spacing: 0%;
      margin: auto 20px auto auto;
    }
  }

  .right-second {
    display: flex;
    flex: 1 1 auto;

    .preview-area {
      width: 70%;
      min-width: 200px;
      padding: 20px 10px;
      // padding, top menu height 계산
      height: calc(100vh - 110px);
      border-right: 1px solid #D2D5DA;
      overflow-x: hidden;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .menu-area {
      width: 30%;
      min-width: 200px;
      flex: 1 0 auto;
      height: calc(100vh - 70px);
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #F8F9FB;

      &::-webkit-scrollbar {
        display: none;
      }

      .menu-table {
        .stories {
          .story {
            margin-bottom: 40px;

            .story-menu {
              display: flex;
              margin: 0 10px 15px 10px;

              .story-badge {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: #FFFFFF;
                background-color: #A0A5B1;
                height: 22px;
                padding: 0 5px;
                font-weight: 600;
                line-height: 29px;
                letter-spacing: 0%;
                font-size: 16px;
              }

              .story-btn {
                margin-left: auto;

                button {
                  color: #636A79;
                  border: 1px solid #D2D5DA;
                  background-color: #ECEDEF;
                  border-radius: 6px;
                  padding: 5px 22px;
                  font-weight: 600;
                  font-size: 14px;
                  line-height: 20px;
                  height: 30px;
                  width: 80px;

                  img {
                    display: block;
                    margin: auto;
                    height: 14px;
                    width: 14px;
                  }
                }

                .active {
                  background-color: #CCCFD7;
                  border: 1px solid #ECEDEF;
                  color: #ECEDEF;
                }
              }
            }
          }
        }

        .table-title {
          height: 67px;
          padding: 0 10px;
          color: #32363E;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          // background-color: #F8F9FB;
          font-size: 22px;
          font-weight: 700;
        }

        .table-content {
          table {
            border-top: 1px solid #ECEDEF;
            width: 100%;
            color: #636A79;
            background-color: #FFFFFF;
            font-size: 16px;
            border-spacing: 0;

            thead {
              height: 67px;
            }

            tbody {
              text-align: center;
              height: 67px;
            }

            td {
              padding: 10px;
            }

            th,
            td {
              &:hover {
                cursor: pointer;
              }

              border-bottom: 1px solid #ECEDEF;
            }

            input {
              width: calc(100% - 30px);
              padding: 0 15px;
              border: 1px solid #ECEDEF;
              border-radius: 10px;
              height: 40px;
            }
          }
        }
      }

      .type-badge {
        border-radius: 10px;
        padding: 2px 9px;
        color: #A0A5B1;
        background-color: #ECEDEF;
        line-height: 20px;
        letter-spacing: 0%;
        font-size: 13px;
        font-weight: 700;
      }
    }
  }

  .third-area {
    background-color: lightblue;
  }
}

.code {
  background-color: #F1F3F5;
  border-radius: 0.5rem;
  padding: 30px;
}
</style>