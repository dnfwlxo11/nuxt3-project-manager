<template>
  <div class="wrapper-tags">
    <div v-if="$slots.input" class="input">
      <slot name="input" />
    </div>
    <div v-if="$slots.tags" class="tags">
      <slot name="tags" />
    </div>
    <div v-if="$slots.default" class="tags">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.wrapper-tags {
  height: 100%;

  & .input {
    padding: 10px;
  }

  & .tags {
    padding: 10px;
    max-width: 100%;
  }
}
</style>