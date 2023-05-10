<template>
  <div class="test">
    <div class="left">
      <slot name="left" />
    </div>
    <div class="right">
      <slot name="right" />
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.test {
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;

  .left {
    overflow-y: scroll;

    &::-webkit-scrollbar {
      display: none;
    }

    background-color: #F8F9FB;
    height: 100vh;
    width: 412px;
  }

  .right {
    height: 100vh;
    flex: 1 1 auto;
  }
}
</style>