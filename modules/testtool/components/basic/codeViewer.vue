<template>
  <div class="code-viewer">
    <!-- <pre class="code" v-for="(code, idx) of p_code" :key="idx">{{ code }}</pre> -->
    <pre class="code" v-for="(code, idx) of p_code" :key="idx"><code :ref="(el) => setArrRef(el)">{{ code }}</code></pre>

    <div class="copy-btn">
      <div class="content">COPY</div>
    </div>
  </div>
</template>

<script setup>
import hljs from 'highlight.js/lib/common'

const $props = defineProps({
  code: {
    type: Array,
    default: [],
  }
})

const { code: p_code } = toRefs($props)
const codes = ref([])

const setArrRef = (el) => {
  codes.value.push(el)
}

onMounted(() => {
  codes.value.map((code, idx) => {
    const result = hljs.highlightAll(code.innerHTML)
    // console.log(JSON.stringify(result.value))
    // console.log(code.html, 'html')
    // code.html(result.value)
    // code.addClass('hljs')
  })
})
</script>

<style lang="scss" scoped>
.code-viewer {
  position: relative;
  background-color: #1C1E22;
  padding: 20px;
  min-height: 300px;
  border-radius: 4px 4px 0px 0px;


  .code {
    color: white;
    white-space: pre-wrap;
  }
}

.copy-btn {
  position: absolute;
  top: 0;
  left: calc(100% - 86px);
  width: 86px;
  height: 34px;
  border-left: 1px solid #F8F9FB;
  border-bottom: 1px solid #F8F9FB;

  .content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #F8F9FB;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0%;
    line-height: 29px;
  }
}
</style>