<template>
  <CompoundLayout-md_container>
    <br><br><br><br><br>

    <div>
      <h1>Compound</h1> <button @click="_isShows[0] = !_isShows[0]">{{ _isShows[0] ? '접기' : '펼치기' }}</button>

      <div v-if="_isShows[0]" class="scaffold">
        <div>
          <h2>Compound tags (width: 200px)</h2>
          <Compound-tags class="card" style="width: 200px;">
            <template #tags>
              <BasicAtom-tag v-for="(item, idx) of _globalTags" :key="idx" :tag="item.tag" :color="item.color" />
            </template>
          </Compound-tags>
        </div>

        <br>

        <div>
          <h2>Compound tags with input (width: 200px)</h2>
          <Compound-tags class="card" style="display: block;width: 200px;">
            <template #input>
              <BasicAtom-input :placeholder="'태그 선택 또는 만들기'" style="padding: 10px;" />
            </template>
            <template #tags>
              <BasicAtom-tag v-for="(item, idx) of _globalTags" :key="idx" :tag="item.tag" :color="item.color"
                :icon="'close'" />
            </template>
          </Compound-tags>
        </div>

        <br><br>

        <div>
          <h2>Compound Floating (height, width: 500px)</h2>

          <div class="grid-layout">
            <div class="item" v-for="( item, idx ) of  [1, 2, 3, 4, 5, 6, 7, 8, 9] " :key="idx">
              <Compound-floating>
                <template #default>
                  <Compound-tags class="card" style="display: block;width: 100%;height: 100%;"
                    @click.self="f_onClickGrid(idx)">
                    <template #tags>
                      <BasicAtom-tag v-for="( item, idx ) of  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] " :key="idx"
                        :tag="item.toString()" :color="item.toString()" />
                    </template>
                  </Compound-tags>
                </template>
                <template #floatItem v-if="_isFloat && _currItem === idx">
                  <BasicMo-tag_input class="card" :direction="'horiz'" :globalTags="_globalTags" :icon="'close'"
                    :tags="_tags" @update:tags="f_loadData" />
                </template>
              </Compound-floating>
            </div>
          </div>
        </div>

        <br><br>
      </div>

      <hr>

      <h1>Basic</h1> <button @click="_isShows[1] = !_isShows[1]">{{ _isShows[1] ? '접기' : '펼치기' }}</button>

      <div v-if="_isShows[1]" class="scaffold">
        <div>
          <h2>Basic Tag</h2>
          <BasicAtom-tag
            v-for="(item, idx) of Array(20).fill(0).map((v, i) => { return { tag: (i + 1).toString(), color: parseInt(Math.random() * 10).toString() } })"
            :key="idx" :tag="item.tag" />
        </div>

        <br>

        <div>
          <h2>Basic Tag (added icon)</h2>
          <BasicAtom-tag
            v-for="(item, idx) of Array(20).fill(0).map((v, i) => { return { tag: (i + 1).toString(), color: parseInt(Math.random() * 10).toString() } })"
            :key="idx" :tag="item.tag" :icon="'close'" />
        </div>

        <br>

        <div>
          <h2>Basic input</h2>
          <BasicAtom-input :placeholder="'태그 선택 또는 만들기'" />
        </div>

        <br><br>
      </div>

      <hr>

      <h1>Compound</h1> <button @click="_isShows[2] = !_isShows[2]">{{ _isShows[2] ? '접기' : '펼치기' }}</button>

      <div v-if="_isShows[2]" class="scaffold">
        <div>
          <h2>Compound tagInputVerti (width: 300px)</h2>
          <BasicMo-tag_input class="card" :direction="'verti'" :globalTags="_globalTags" :tags="_tags"
            style="width: 300px;" />
        </div>

        <br>

        <div>
          <h2>Compound tagInputHoriz</h2>
          <BasicMo-tag_input class="card" :direction="'horiz'" :globalTags="_globalTags" :tags="_tags" />
        </div>

        <br><br>
      </div>

      <hr>

      <h1>Playground <small>(Based on LocalStorage)</small></h1> <button @click="_isShows[3] = !_isShows[3]">{{
        _isShows[3] ?
        '접기' : '펼치기'
      }}</button>

      <br><br>

      <div v-if="_isShows[3]" class="scaffold">



        <div>
          <h2>Tag input example (width: 70%)</h2>
          <BasicAtom-button :name="'방향 전환 버튼'" @click="onChangeDirection" />
          <br><br>
          <!-- <Compound-verti> -->
          <BasicMo-tag_input class="card" style="width: 70%;" :direction="_direction" :globalTags="_globalTags"
            :icon="'close'" :tags="_tags" @update:tags="(tags) => f_saveData(tags)"
            @delete:tag="(tag) => f_deleteData(tag)">

            <template #input></template>
            <template #tags></template>
          </BasicMo-tag_input>
          <!-- </Compound-verti> -->
        </div>




        <br><br>
      </div>
      <hr>
    </div>

    <br><br><br><br><br>
  </CompoundLayout-md_container>
</template>

<script setup>
const _isShows = ref([false, false, false, true])
const _isFloat = ref(false)
const _currItem = ref(null)
const _globalTags = ref([])
const _tags = ref([])
const _direction = ref('verti')

const f_loadData = () => {
  _globalTags.value = JSON.parse(localStorage.getItem('global')) || []
  _tags.value = JSON.parse(localStorage.getItem('tags')) || []
}

const f_saveData = ({ table, tags }) => {
  localStorage.setItem(table, JSON.stringify(tags))

  f_loadData()
}

const f_deleteData = ({ table, tag }) => {
  let tmp_data

  if (table === 'global') tmp_data = _globalTags.value.filter(item => item.tag !== tag)
  else tmp_data = _tags.value.filter(item => item.tag !== tag)

  localStorage.setItem(table, JSON.stringify(tmp_data))

  f_loadData()
}

const f_onClickGrid = (idx) => {
  _isFloat.value = !_isFloat.value
  _currItem.value = idx
}

const onChangeDirection = () => {
  _direction.value === 'verti' ? _direction.value = 'horiz' : _direction.value = 'verti'
}

onMounted(() => {
  f_loadData()
})
</script>

<style lang="scss" scoped>
h1 {
  display: inline;
}

.card {
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
}

.scaffold {
  animation: .5s scaffold linear;
}

.overlay-float {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  position: absolute;
  top: 0;
  left: 0;
}

.grid-layout {
  display: grid;
  border: 1px solid lightgrey;
  width: 500px;
  height: 500px;
  grid-column: 3;
  grid-template-columns: repeat(3, 1fr);
  z-index: 2;

  & .item {
    // overflow: auto;
    max-height: 100%;
    max-width: 100%;
    border-right: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;

    &:hover {
      cursor: pointer;
      background-color: lightgrey;
    }
  }
}

@keyframes scaffold {
  0% {
    opacity: 0;
    transform: translate3d(0, -5%, 0);
  }

  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
</style>