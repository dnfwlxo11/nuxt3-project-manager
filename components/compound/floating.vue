<template>
  <div class="wrapper-floating">
    <slot name="default" />
    <div class="floating-item">
      <slot name="floatItem" />
    </div>
  </div>
</template>


<style lang="scss" scoped>
.wrapper-floating {
  width: 100%;
  height: 100%;
  position: relative;

  & .floating-item {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>