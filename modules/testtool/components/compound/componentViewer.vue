<template>
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
    <div v-if="p_stories.length" class="preview-tabs">
      <div class="tab" :class="{ 'active': item === _currentTab }" v-for="(item, idx) of p_stories" :key="idx"
        @click="f_selectStory(item)">
        <span class="tab-name">{{ item }}</span>
      </div>
    </div>
    <div class="preview-content">
      <slot />
    </div>
  </div>
</template>
  
<script setup>
const $props = defineProps({
  stories: {
    type: Array,
    default: []
  },
  tab: {
    type: String,
    default: 'default',
  }
})
const emit = defineEmits(['update:tab'])
const { stories: p_stories, tab: p_tab } = toRefs($props)
const _currentTab = ref()
const f_selectStory = (name) => {
  _currentTab.value = name
  emit('update:tab', _currentTab.value)
}
watch(p_tab, (newVal) => {
  _currentTab.value = newVal
}, { immediate: true })
</script>
  
<style lang="scss" scoped>
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

  .preview-tabs {
    display: flex;
    width: 100%;
    max-width: 100%;
    height: 30px;
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid #ECEDEF;
    background-color: #F8F9FB;

    &::-webkit-scrollbar {
      display: none;
    }

    .active {
      color: #ECEDEF;
      background-color: #CCCFD7;
    }

    .tab {
      height: 100%;
      width: calc(100% / v-bind('p_stories.length ? p_stories.length : 1'));
      min-width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #69717F;
      font-size: 16px;
      border-right: 1px solid #ECEDEF;

      .tab-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }

  .preview-content {
    height: 330px;
    padding: 10px;
  }
}</style>