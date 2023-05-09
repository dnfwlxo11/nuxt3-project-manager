<template>
  <div>
    <div class="first">
      <slot name="first" />
    </div>
    <div class="second">
      <slot name="second" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.first {
  border-radius: 0.5rem 0.5rem 0 0;
  max-height: 150px;
  overflow-y: auto;
}

.second {
  border-radius: 0 0 0.5rem 0.5rem;
  height: 40%;
  max-height: 300px;
  overflow-y: auto;
}
</style>