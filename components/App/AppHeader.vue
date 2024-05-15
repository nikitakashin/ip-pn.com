<template>
  <div class="app-header">
    <div class="app-header--container">
      <div class="title">ip-pn.com</div>

      <el-input class="search-field" placeholder="95.213.138.174"></el-input>

      <el-menu class="navigation" mode="horizontal">
        <el-menu-item>Documentation</el-menu-item>
        <el-menu-item>Contacts</el-menu-item>
        <el-menu-item><b>Log in</b></el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
// Глобальные импорты
// END OF Глобальные импорты

// Локальные импорты
// END OF Локальные импорты

// Импорты типов
// END OF Импорты типов

// Локальные типы
// interface IProps {

// }
// END OF Локальные типы

// Глобальные переменные
// const { services } = useNuxtApp();
// END OF Глобальные переменные

// Пропсы
// const props = withDefaults(defineProps<IProps>(), {

// });
// END OF Пропсы

// Локальные переменные
// END OF Локальные переменные

// Вычисляемые параметры
// END OF Вычисляемые параметры

// Методы
// END OF Методы

// Хуки
// END OF Хуки
</script>

<style lang="scss" scoped>
.app-header {
  width: 100%;
  height: 100px;
  background: rgba(242, 240, 240, 1);

  &--container {
    padding: 26px 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-family: Poppins;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
      text-align: left;
    }

    .search-field {
      max-width: 460px;
      height: 48px;
      font-family: Inter;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      text-align: left;
    }

    .navigation {
      background: transparent;
      border: none;
      font-family: Inter;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      text-align: left;
      width: 350px;
    }
  }
}
</style>
