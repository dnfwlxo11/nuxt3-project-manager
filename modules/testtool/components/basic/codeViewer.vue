<template>
  <div class="code-viewer">
    <div class="viewer-menu">
      <div class="viewer-title">
        <img :src="`/assets/icons/${p_icon}.svg`">
        <div class="type">
          {{ p_type }}
        </div>
      </div>
      <div class="copy-btn">
        <div class="content" @click="f_copyCode">COPY</div>
      </div>
    </div>
    <div class="viewer-content" ref="contentCodes">
      <pre class="code" v-for="(code, idx) of _code" :key="idx"><code :ref="(el) => codes.push(el)">{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import hljs from 'highlight.js/lib/common'

const $props = defineProps({
  icon: {
    type: String,
    default: 'hexagon',
  },
  code: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    deafult: '',
  }
})

const { code: p_code, type: p_type, icon: p_icon } = toRefs($props)
const codes = ref([])
const _code = ref()
const contentCodes = ref()

const f_copyCode = () => {
  const text = contentCodes.value.innerText
  const result = (async () => {
    await navigator.clipboard.writeText(text)
  })()
}

onMounted(() => {
  codes.value.map((code, idx) => {
    if (code) hljs.highlightBlock(code)
  })
})

watch(p_code, (code) => {
  _code.value = code
}, {immediate:true})
</script>

<style lang="scss" scoped>
.hljs {
  background-color:#1C1E22;
}

.code-viewer {
  position: relative;
  background-color: #1C1E22;
  min-height: 260px;
  border-radius: 4px 4px 0px 0px;

  .viewer-menu {
    display: flex;
    align-items: center;
    height: 34px;
    color: #F8F9FB;
    font-size: 14px;
    font-weight: 500;
    line-height: 29px;
    border-bottom: 1px solid #494F5A;

    .viewer-title {
      display: flex;
      align-items: center;
      padding-left: 17.5px;

      .type {
        margin-left: 7.5px;
      }
    }

    .copy-btn {
      margin-left: auto;
      text-align: center;
      font-weight: 700;
      width: 86px;
      border-left: 1px solid #494F5A;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .viewer-content {
    padding: 0 20px;
    overflow: auto;
  }
  .code {
    color: white;
    white-space: pre-wrap;
  }
}
</style>