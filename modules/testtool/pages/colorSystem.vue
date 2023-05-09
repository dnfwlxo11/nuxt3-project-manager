<template>
  <test-layout>
    <template #left>
      <div class="theme" v-for="(theme, idx) of Object.keys(c_allThemes)" :key="idx" @click="f_setTargetTheme(theme)">
        {{ theme }}
      </div>

    </template>
    <template #right>
      <div v-if="c_basic" class="basic-area">
        <h2>Basic</h2>
        <div v-for="(color, colorIdx) of Object.keys(c_basic)" :key="colorIdx">
          <h4>{{ color }}</h4>
          <div v-for="(number, numIdx) in c_basic[color]" :key="numIdx">
            {{ number }}
          </div>
        </div>
      </div>
      <br>
      <h3>Theme ({{ _currTheme }})</h3>
      <div v-if="_targetTheme" class="theme-area">
        <div v-for="(color, idx) of Object.keys(_targetTheme)" :key="idx">
          <h4>
            {{ color }}
          </h4>
          <div class="colors-container">
            <div class="color-box">
              <div class="color-area">
                <div :style="`height: 100%;width: 100%;background-color: ${_targetTheme[color]};`"></div>
              </div>
              <div class="color-desc">
                <small>{{ _targetTheme[color] }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </test-layout>
</template>

<script setup>
import TestLayout from '@/modules/testtool/layout/default.vue'

onMounted(() => {
  f_setTargetTheme()
})

const c_allThemes = computed(() => {
  const themes = defineThemes()
  delete themes['basic']

  return themes
})
const c_basic = computed(() => {
  return defineBasic()
})
const _currTheme = ref()
const _targetTheme = ref()

const f_setTargetTheme = (theme = 'light') => {
  const themeVal = c_allThemes.value[theme]
  delete themeVal['basic']

  _currTheme.value = theme
  _targetTheme.value = themeVal
}
</script>

<style lang="scss" scoped>
.left {
  .theme {
    width: 100%;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.theme-area {
  margin: 30px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  .colors-container {
    width: 80%;

    .color-box {
      border: 1px solid black;
      height: 150px;
      width: 150px;

      .color-area {
        height: 70%;
        border-bottom: 1px solid lightgrey;
      }

      .color-desc {
        display: flex;
        height: 30%;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.themes-area {
  margin: 30px 0;
}
</style>