<template>
  <div class="page-index">
    <div class="start-form">
      <el-input
        v-model="searchValue"
        class="textarea"
        :rows="4"
        type="textarea"
        placeholder="Введите IP адреса"
      />

      <div class="submit-button-container">
        <el-button type="info" @click="search">Отправить</el-button>
      </div>

      <el-table
        class="table"
        :data="tableData"
        style="width: 100%"
        max-height="250"
      >
        <el-table-column fixed prop="query" label="IP" width="150">
          <template #default="scope">
            <img class="flag" :src="scope.row.icon" />
            {{ scope.row.query }}
          </template>
        </el-table-column>
        <el-table-column prop="country" label="Country" width="120" />
        <el-table-column prop="city" label="City/Town" width="120" />
        <el-table-column fixed="right" label="" width="120">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deleteRow(scope.$index)"
            >
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findFlagUrlByIso2Code } from "country-flags-svg";
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
// END OF Глобальные переменные

// Пропсы
// const props = withDefaults(defineProps<IProps>(), {

// });
// END OF Пропсы

// Локальные переменные
const searchValue = ref(`7.7.7.7
8.8.8.8
24.48.0.1
195.16.32.227
`);
const itemStore = ref({});
// END OF Локальные переменные

// Вычисляемые параметры
const tableData = computed(() => {
  return Object.values(itemStore.value);
});
// END OF Вычисляемые параметры

// Методы
const getItemData = async (ip) => {
  console.log("ip", ip);
  const { data, errors } = await $services.IPApi.read(ip);

  const icon = findFlagUrlByIso2Code(data.countryCode);

  const item = {
    ...data,
    icon,
  };

  itemStore.value[item.query] = item;
};

const prepareSearchValue = (searchValue) => {
  return searchValue.split("\n").filter((ip) => ip);
};

const search = async () => {
  const searchValues = prepareSearchValue(searchValue.value);
  searchValue.value = "";

  for (let ip of searchValues) {
    await getItemData(ip);
  }
};
// END OF Методы

// Хуки
// END OF Хуки
</script>

<style lang="scss" scoped>
.page-index {
  margin-top: 80px;

  .start-form {
    display: block;

    .textarea {
      width: 620px;
      font-family: Inter;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      text-align: left;
    }

    .submit-button-container {
      font-family: Inter;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      text-align: left;

      margin-top: 20px;
    }

    .table {
      .flag {
        width: 21px;
      }
    }
  }
}
</style>
