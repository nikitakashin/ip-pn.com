<template>
  <app-header />
  <el-container>
    <el-main>
      <div class="container">
        <slot />
      </div>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>
.import-gobal-scss {
  display: flex;
}

.container {
  margin: 0 84px;
}
</style>
