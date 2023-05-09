<template>
  <div class="horiz">
    <div class="first">
      <slot name="first" />
    </div>
    <div class="second">
      <slot name="second" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horiz {
  height: 100%;
  overflow: hidden;
  width: 100%;
  display: flex;

  .first {
    border-radius: 0.5rem 0 0 0.5rem;
    width: 60%;
    min-width: 100px;
    max-height: 300px;
    overflow-y: auto;
  }

  .second {
    width: 40%;
    min-width: 200px;
    max-height: 300px;
    overflow: auto;

    &::-webkit-scrollbar-thumb {
      border-radius: 0 0.5rem 0.5rem 0;
      border: 4px solid transparent;
      background-clip: padding-box;
    }
  }
}
</style>