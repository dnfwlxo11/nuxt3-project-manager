<template>
  <h2>
    <slot name="title"></slot>
  </h2>
  <div>
    <slot name="item" :="item" v-for="item in sortedData"></slot>
  </div>
  <div>
    <slot name="footer"></slot>
  </div>
</template>