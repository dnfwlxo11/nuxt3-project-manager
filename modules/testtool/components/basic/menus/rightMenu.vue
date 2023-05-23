<template>
  <div class="right-menu">
    <div class="right-first">
      <!-- <div class="menu-tab">
        <div class="menu" :class="{ 'active': _selectTab === menu }" v-for="(menu, idx) of ['develop', 'design']"
          :key="idx" @click="_selectTab = menu">
          {{ menu.toUpperCase() }}
        </div>
      </div> -->
      <div class="title">
        Playground
      </div>
    </div>
    <div v-if="_fileData" class="right-second">
      <DoubleHorizResizeComponent>
        <template #leftSide>
          <div class="preview-area">
            <div v-if="!c_isComponent">
              <div>
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
              <div class="stories">
                <div class="story" :class="{ 'active': _currentTab === story }" v-for="(story, idx) of _stories"
                  :key="idx" @click="applyStory(story, _dummy[story])">
                  {{ story }}
                </div>
                <div class="story-add">
                  <img src="/assets/icons/hexagon.svg">
                </div>
              </div>
              <LineSpaceDiv :space="7" />
              <ComponentViewer>
                <Component :is="c_currentComponent" ref="currentComponentRef" :="_currentStory" />
              </ComponentViewer>
              <LineSpaceDiv :space="30" />
              <SecondTitle :content="'CODE'" />
              <div class="codes">
                <CodeViewer v-if="_fileData.templateCode" :code="_fileData.templateCode" :type="'Template'" />
                <LineSpaceDiv :space="26" />
                <CodeViewer v-if="_fileData.scriptCode" :code="_fileData.scriptCode" :type="'Script'" />
                <LineSpaceDiv :space="26" />
                <CodeViewer v-if="_fileData.styleCode" :code="_fileData.styleCode" :type="'Style'" />
              </div>
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
                <div class="story" v-for="(item, key) in _dummy" :key="idx">
                  <div class="story-menu" @click="applyStory(key, item)">
                    <div class="story-badge" :class="{ 'active': _currentTab === key }">
                      <span>{{ key }}</span>
                    </div>
                  </div>
                  <div class="table-content">
                    <table class="table" :class="{ 'active': _currentTab === key }">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="(dummyItem, key) in item" :key="key">
                          <tr v-if="key !== 'name' && key !== 'added'">
                            <td>{{ key }}</td>
                            <td><input type="text" v-model="item[key]"></td>
                          </tr>
                        </template>
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
      </DoubleHorizResizeComponent>
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
import DoubleHorizResizeComponent from '@/modules/testtool/components/compound/doubleHorizResizeComponent.vue'
import Preview from '@/modules/testtool/components/compound/preview.vue'
// import Preview from '@/modules/testtool/pages/preview.vue'

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
const _dummy = ref({
  '#STORY01': { test: "prop test1", content: "Button1", added: false },
  '#STORY02': { test: "prop test2", content: "Button2", added: false },
  '#STORY03': { test: "prop test3", content: "Button3", added: false },
})
const _storyComponent = ref([])
const _currentStory = ref()
const $router = useRouter()
const { params } = useRoute()
const _componentTree = useState('componentsTree')
const _currentTab = ref('default')

const f_getPropsData = (props) => {
  const propsData = {}
  Object.entries(props[0]).forEach(([key, data]) => propsData[key] = data['default'])

  return propsData
}

const f_treeCircuit = (target, searchName, flag = 1) => {
  Object.entries(target).map(([key, value]) => {
    if (value.item.length) {
      value.item = value.item.map((item, idx) => {
        const projectPathArr = item.projectPath.split('/').slice(1)
        const lastName = projectPathArr[projectPathArr.length - 1].toLowerCase().replace('.vue', '')

        if (lastName === 'index') projectPathArr.pop()

        const componentName = projectPathArr.join('').toLowerCase().replace('.vue', '')

        if (searchName === componentName) return { ...item, related: flag }
        else return item
      })
    }
    if (value.child.length) {
      value.child.map(item => {
        f_treeCircuit(item, searchName, flag)
      })
    }
  })

  return target
}

const applyStory = (key, value) => {
  if (key === 'default') {
    _currentStory.value = {}
  } else {
    _currentStory.value = value
  }

  _currentTab.value = key
}

const f_addedStory = (story) => {
  Object.entries(story).map(([key, value]) => {
    if (value.added) {
      value.added = false
      _stories.value = _stories.value.filter(item => item !== key)
      _currentTab.value = 'default'
      _currentStory.value = {}
    } else {
      value.added = true
      _stories.value.push(key)
    }
  })
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

onMounted(() => {
  Object.entries(_dummy.value).map(([key, value]) => {
    _stories.value.push(key)
  })
})

watch(currentComponentRef, (newVal) => {
  nextTick(() => {
    if (!newVal) return

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

  _componentTree.value = f_treeCircuit(_componentTree.value, c_currentComponent.value.toLowerCase())
  _fileData.value.relativeCode.map(related => {
    _componentTree.value = f_treeCircuit(_componentTree.value, related.componentName, 2)

    if (related.related) {
      related.related.map(item => {
        _componentTree.value = f_treeCircuit(_componentTree.value, item.componentName, 3)
      })
    }
  })
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
      // width: 400px;
      padding: 20px 10px;
      // padding, top menu height 계산
      height: calc(100vh - 110px);
      border-right: 1px solid #D2D5DA;
      overflow-x: hidden;
      overflow-y: auto;

      .stories {
        display: flex;
        position: relative;
        box-sizing: border-box;
        border-bottom: 1px solid #C1C5CD;

        .story {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          height: 26px;
          font-size: 11px;
          font-weight: 600;
          line-height: 29px;
          letter-spacing: 0%;
          color: #C1C5CD;

          &:hover {
            cursor: pointer;
          }
        }

        .story-add {
          position: absolute;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 26px;
        }

        .active {
          color: #494F5A;
          border-bottom: 4px solid #494F5A;
        }
      }

      .codes {
        padding: 16px;
        background-color: #32363E;
      }

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

                &.active {
                  background-color: #7966FF;
                }
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
          .active {
            outline: 3px solid #7966FF;
            outline-offset: -3px;
          }

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
</style>