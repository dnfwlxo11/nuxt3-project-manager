<template>
  <div class="right-menu">
    <div class="right-top">
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
    <div v-if="_fileData" class="right-bottom">
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
          <div class="preview-component">
            <div class="preview-menu">
              <div class="zoom">
                <img src="/assets/icons/magnify-minus.svg">
                <div class="zoom-badge">100%</div>
                <img src="/assets/icons/magnify-plus.svg">
              </div>
              <div class="viewer">
                <img src="/assets/icons/export.svg">
              </div>
            </div>
            <div class="preview-content">
              <Component :is="c_currentComponent" ref="currentComponentRef" />
            </div>
          </div>
          <LineSpaceDiv :space="30" />
          <SecondTitle :content="'CODE'" />
          <CodeViewer :code="_fileData.templateCode" />
        </div>
      </div>
      <div class="menu-area">
        <div class="menu-table">
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
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>



        <!-- <div class="bottom-menus">
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
                  <Component :is="c_currentComponent" :="_storyPropsData" />
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
                  <div class="theme-card" v-for="( theme, idx ) of  Object.keys(c_allThemes) " :content="theme"
                    :key="idx">
                    테마: {{ theme }}

                    <Wrapper-theme :theme="theme">
                      <Component :is="c_currentComponent" ref="currentComponentRef" />
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
                  <Component :is="c_currentComponent" ref="currentComponentRef" />
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
        </div> -->
      </div>
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
const { params } = useRoute()

const f_getPropsData = (props) => {
  const propsData = {}
  Object.entries(props[0]).forEach(([key, data]) => propsData[key] = data['default'])

  return propsData
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
}
)
</script>

<style lang="scss" scoped>
.right-menu {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100vh;

  .right-top {
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

  .right-bottom {
    display: flex;

    flex: 1 1 auto;

    .preview-area {
      padding: 20px 10px;
      flex: 1 1 auto;
      // padding, top menu height 계산
      height: calc(100vh - 110px);
      border-right: 1px solid #D2D5DA;
      overflow-x: hidden;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .preview-component {
        border: 1px solid #ECEDEF;
        background-color: #FFFFFF;
        border-radius: 4px 4px 0px 0px;

        .preview-menu {
          border-bottom: 1px solid #ECEDEF;
          height: 50px;
          display: flex;

          img {
            width: 16px;
            height: 16px;
            min-width: 16px;
            min-height: 16px;
          }

          .zoom {
            display: flex;
            align-items: center;
            margin: auto 20px;

            .zoom-badge {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: auto 5px auto 5px;
              padding: 2px 5px;
              width: 60px;
              height: 20px;
              font-size: 14px;
              border-radius: 18px;
              background-color: #ECEDEF;
            }
          }

          .viewer {
            margin: auto 20px auto auto;
          }
        }

        .preview-content {
          height: 330px;
          padding: 10px;
        }
      }
    }

    .menu-area {
      min-width: 200px;
      width: 250px;
      background-color: #FFFFFF;
      text-align: center;

      .menu-table {
        .table-title {
          height: 67px;
          padding: 0 10px;
          color: #32363E;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          background-color: #F8F9FB;
          border-bottom: 1px solid #ECEDEF;
          font-size: 22px;
          font-weight: 700;
        }

        .table-content {
          table {
            width: 100%;
            color: #636A79;
            font-size: 16px;

            thead {
              height: 67px;
            }

            tbody {
              height: 67px;
            }

            th,
            td {
              border-bottom: 1px solid #ECEDEF;
            }
          }
        }
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