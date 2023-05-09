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

<style lang="scss">
.test {
  margin: 0 auto;
  height: calc(100vh - 20px);
  display: flex;

  .left {
    padding: 30px 20px;
    width: 30%;
    overflow: auto;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  .right {
    padding: 40px;
    width: 70%;
    overflow: auto;
  }
}
</style>