<template>
  <div class="preview-component">
    <div class="preview-menu">
      <div v-if="!p_device && _currentDevice" class="device-menu">
        Dimension:&nbsp;&nbsp;<span class="device-more" @click="_showDevices = !_showDevices">
          {{ _currentDevice.name }} <img src="/assets/icons/more-arrow.svg">
        </span>
        <div v-if="_showDevices" class="devices">
          <div class="device" :class="{ 'active': 'Responsive' === _currentDevice.name }"
            @click="_currentDevice = _defaultResponsive; _showDevices = false">
            Responsive
          </div>
          <hr>
          <div class="device" v-for="(item, idx) of devices" :key="idx" :class="{ 'active': item.name === _currentDevice.name }"
            @click="_currentDevice = item; _showDevices = false">
            {{ item.name }}
          </div>
        </div>
        <div class="badge">
          <input type="number" v-model="_currentDevice.width" :disabled="_currentDevice.name !== 'Responsive'" @change="f_sizeVaild('w')">
        </div>
        <img src="/assets/icons/multiply.svg" alt="">
        <div class="badge">
          <input type="number" v-model="_currentDevice.height" :disabled="_currentDevice.name !== 'Responsive'" @change="f_sizeVaild('h')">
        </div>
      </div>
      <div class="device" v-else>
        @{{ p_device.charAt(0).toUpperCase() + p_device.slice(1) }}
      </div>

      <div class="zoom">
        <img src="/assets/icons/magnify-minus.svg" @click=" f_zoomOut ">
        <div class="badge">
          <div class="zoom-percentage">{{ (_zoomPercentage * 100).toFixed(0) }}%</div>
        </div>
        <img src="/assets/icons/magnify-plus.svg" @click=" f_zoomIn ">
      </div>
      <div class="viewer">
        <img src="/assets/icons/export.svg" @click="_showModal=true">
      </div>
    </div>
    <div v-if="p_stories.length" class="preview-tabs">
      <div class="tab" :class="{ 'active': item === _currentTab } " v-for="(item, idx) of p_stories"
        :key="idx" @click="f_selectStory(item)">
        <span class="tab-name">{{ item }}</span>
      </div>
    </div>
    <div class="preview-content" ref="previewContentRef">
      <div class="preview-inner">
        <slot />
      </div>

      <!-- <iframe class="preview-inner" src="/test/preview" frameborder="0">
        <slot />
      </iframe> -->
    </div>
    <previewModal v-if="_showModal" @modal:close="(device) => f_updateDevice(device)" :device="_currentDevice" :defaultResponsive="_defaultResponsive">
      <slot />
    </previewModal>
  </div>
</template>

<script setup>
import previewModal from '@/modules/testtool/components/compound/modal/previewModal.vue'
import SingleResizeComponent from '@/modules/testtool/components/compound/singleResizeComponent.vue'

const $props = defineProps({
  stories: {
    type: Array,
    default: []
  },
  tab: {
    type: String,
    default: 'default',
  },
  device: {
    type: String,
    default: '',
  }
})

const emit = defineEmits(['update:tab'])
const { stories: p_stories, tab: p_tab, device: p_device } = toRefs($props)
const _currentTab = ref()
const _showDevices = ref(false)
const previewContentRef = ref()
const _currentDevice = ref()
const _zoomPercentage = ref(1.0)
const _showModal = ref(false)
const _defaultResponsive = ref({ name: 'Responsive', width: 1024, height: 720 })

const devices = ref([
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPad Air', width: 820, height: 1180 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'Surface Pro 7', width: 1368, height: 912 },
  { name: 'Galaxy Fold', width: 280, height: 653 },
  { name: 'Galaxy S8+', width: 360, height: 740 },
])

const f_sizeVaild = (direction) => {
  if (direction === 'w' && _currentDevice.value.width >= 10000) _currentDevice.value.width = 9999
  else if (direction === 'h' && _currentDevice.value.height >= 10000) _currentDevice.value.height = 9999
}

const f_selectStory = (name) => {
  _currentTab.value = name
  emit('update:tab', _currentTab.value)
}

const f_zoomIn = () => {
  if (_zoomPercentage.value >= 10.0) return

  if (_zoomPercentage.value < 0.1) _zoomPercentage.value += 0.01
  else if (_zoomPercentage.value < 1.0) _zoomPercentage.value += 0.1
  else if (_zoomPercentage.value >= 1.0 && _zoomPercentage.value < 10.0) _zoomPercentage.value += 0.5
  else _zoomPercentage.value += 1.0

  _zoomPercentage.value = Number(_zoomPercentage.value.toFixed(3))
}

const f_zoomOut = () => {
  if (_zoomPercentage.value <= 0.01) return

  if (_zoomPercentage.value <= 0.1) _zoomPercentage.value -= 0.01
  else if (_zoomPercentage.value <= 1.0) _zoomPercentage.value -= 0.1
  else if (_zoomPercentage.value > 1.0 && _zoomPercentage.value < 10.0) _zoomPercentage.value -= 0.5
  else _zoomPercentage.value -= 1.0

  _zoomPercentage.value = Number(_zoomPercentage.value.toFixed(3))
}

const f_updateDevice = (device) => {
  _currentDevice.value = device
  _showModal.value = false
}

const f_updatePosition = (pos) => {
	_zoomPercentage.value = pos.zoomPercentage
	_currentDevice.value.width = pos.width
	_currentDevice.value.height = pos.height
}

onMounted(() => {
  console.log(previewContentRef.value.offsetWidth, previewContentRef.value.offsetHeight, 'width, height')
  _defaultResponsive.value = { name: 'Responsive', width: previewContentRef.value.offsetWidth - 20, height: previewContentRef.value.offsetHeight - 20  }
  _currentDevice.value = _defaultResponsive.value
})

watch(p_tab, (newVal) => {
  _currentTab.value = newVal
}, { immediate: true })

watch(p_device, (newVal) => {
  _currentDevice.value = newVal
}, { immediate: true })
</script>

<style lang="scss" scoped>
.preview-component {
  border: 1px solid #ECEDEF;
  background-color: #FFFFFF;
  border-radius: 4px 4px 0px 0px;

  .badge {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 5px auto 5px;
    padding: 2px 5px;
    height: 20px;
    width: 60px;
    font-size: 14px;
    border-radius: 18px;
    background-color: #ECEDEF;
    color: #636A79;
  }

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

    .device-menu {
      display: flex;
      position: relative;
      align-items: center;
      margin: auto auto auto 10px;
      font-weight: 500;
      font-size: 13px;
      height: 20px;
      z-index: 2;
      color: #999EA9;

      .device-more {
        border: none;
        color: #999EA9;
        background-color: transparent;
        margin-right: 10px;

        &:hover {
          cursor: pointer;
        }

        img {
          width: 6px;
          height: 6px;
          min-width: 10px;
          min-height: 10px;
        }
      }

      .devices {
        position: absolute;
        backdrop-filter: blur(30px);
        top: calc(50px - 15px);
        width: 120px;
        padding: 5px 10px;
        border: 1px solid #A0A5B1;
        border-radius: 5px;

        .device {
          margin: 5px 0;
          padding: 5px;
          font-weight: 600;

          &:hover {
            background-color: lightgray;
          }
        }
      }

      input {
        background-color: transparent;
        text-align: center;
        border: none;
        width: 50px;
        padding: 2px;
        color: #636A79;
        
        &:focus {
          outline: none;
          border: none;
        }
      }

      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    .zoom {
      display: flex;
      align-items: center;
      margin: auto 20px auto auto;

      .zoom-percentage {
        padding: 0 10px;
      }

      img {
        color: #636A79;
        margin: 0 5px;
      }
    }

    .viewer {
      margin: auto 20px auto 10px;
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
    overflow: auto;
    position: relative;

    .preview-inner {
      position: absolute;
      border: 1px solid lightgray;
      height: v-bind('_currentDevice?.height + "px"');
      width: v-bind('_currentDevice?.width + "px"');

      transform-origin: 0 0;
      transform: scale(v-bind('_zoomPercentage'));
    }
  }
}
</style>