<template>
  <div class="test">
    <!-- <div class="left">
      <slot name="left" />
    </div>
    <div class="right">
      <slot name="right" />
    </div> -->
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.test {
  height: 100vh;
  display: flex;
  overflow: hidden;
}
</style>