<template>
  <div>
    <div v-for="(item, idx) of _components" :key="idx">
      <div v-if="item">
        <side-menus v-if="item" :menus="item" />
      </div>
    </div>
    <div v-for="(item, idx) of _imports" :key="idx">
      <div v-if="item">
        <side-menus v-if="item" :menus="item" />
      </div>
    </div>
    <div v-if="_fileData">
      File Content
      {{ _fileData }}
    </div>
  </div>
</template>

<script setup>
import sideMenus from '@/modules/testtool/sideMenus.vue'
import { io } from 'socket.io-client'

const _socket = ref()
const _imports = ref()
const _components = ref()
const _fileData = ref()
const _preview = ref()

onMounted(() => {
  _socket.value = io('http://localhost:11000')

  _socket.value.on('load:file', (data) => _fileData.value = data)
  _socket.value.on('imports:dirs', (data) => _imports.value = data)
  _socket.value.on('components:dirs', (data) => _components.value = data)
})
</script>