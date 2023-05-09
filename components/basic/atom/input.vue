<template>
  <div class="input">
    <slot :="{ keyword: _keyword }">
      <input ref="input" type="text" :placeholder="p_placeholder" @input.stop="f_onSearch" :value="_keyword"
        @keypress.enter.stop="f_onEnter">
    </slot>
  </div>
</template>

<script setup>
const $props = defineProps({
  keyword: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: '내용을 입력해주세요.'
  }
})

const emit = defineEmits([
  'update:keyword',
  'submit:keyword',
])

const { keyword: p_keyword, placeholder: p_placeholder } = toRefs($props)
const _keyword = ref(null)
const input = ref(null)

const f_onSearch = (evt) => {
  _keyword.value = evt.target.value

  emit('update:keyword', _keyword)
}

const f_onEnter = (evt) => {
  if (!_keyword.value) return

  emit('submit:keyword', {
    tag: _keyword.value,
  })

  _keyword.value = null
}

watch(p_keyword, (newVal) => _keyword.value = newVal.value)
</script>

<style lang="scss" scoped>
.input {
  & input {
    border: none;
    border-bottom: 1px solid lightgrey;
    background-color: inherit;
    outline: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
