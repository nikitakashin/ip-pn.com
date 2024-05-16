<template>
  <div class="page-ip">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="param" label="Param" width="180" />
      <el-table-column prop="value" label="Value" width="180" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

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
const { $services } = useNuxtApp();
const route = useRoute();
// END OF Глобальные переменные

// Пропсы
// const props = withDefaults(defineProps<IProps>(), {

// });
// END OF Пропсы

// Локальные переменные
const tableData = ref([]);
// END OF Локальные переменные

// Вычисляемые параметры
// END OF Вычисляемые параметры

// Методы
// END OF Методы

// Хуки
onMounted(async () => {
  const { data, errors } = await $services.IPApi.read(route.params.ip);

  if (errors) {
    const item = {
      query: ip,
      country: "",
      city: "",
    };

    Object.entries(item).forEach((el) => {
      tableData.value.push({
        param: el[0],
        value: el[1],
      });
    });

    return;
  }

  Object.entries(data).forEach((el) => {
    tableData.value.push({
      param: el[0],
      value: el[1],
    });
  });
});
// END OF Хуки
</script>

<style lang="scss" scoped>
.page-ip {
}
</style>
