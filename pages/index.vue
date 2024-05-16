<template>
  <div class="page-index">
    <div class="start-form">
      <template v-if="!isSearchStarted">
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
      </template>

      <template v-else>
        <el-input
          v-model="searchInTableValue"
          style="width: 380px"
          size="large"
          placeholder="Поиск по таблице..."
          :prefix-icon="Search"
        />
      </template>

      <el-table
        v-show="Object.keys(itemStore).length"
        class="table"
        :data="tableDataFiltered"
        border
        stripe
        row-class-name="table-row"
        max-height="300"
        :header-row-class-name="headerRowClassName"
        @row-click="handleClickRow"
      >
        <el-table-column fixed="left" label="" width="48">
          <template #header>
            <el-checkbox v-model="isSelectedAll"></el-checkbox>
          </template>
          <template #default="scope">
            <el-checkbox v-model="scope.row.selected" @click.stop></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column fixed prop="query" label="IP" width="300">
          <template #header>
            <div class="ip-header">
              <span>IP</span>
              <el-button
                v-if="hasTwoOrMoreSelectedItems"
                class="button-delete"
                type="danger"
                @click="deleteSelected"
              >
                Удалить выбранные
              </el-button>
            </div>
          </template>
          <template #default="scope">
            <div class="ip-cell">
              <div class="flag-and-ip">
                <img
                  @click.stop="copyToClipboard(scope.row.query)"
                  class="flag"
                  :src="scope.row.icon"
                />
                {{ scope.row.query }}
              </div>
              <div class="action">
                <img
                  v-if="scope.row.selected"
                  src="/img/trash-alt.png"
                  @click.stop="deleteItem(scope.row.query)"
                />
                <img v-else src="/img/copy.png" />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="country" label="Country">
          <template #header>
            <div class="country-header">
              <span>Country</span>

              <el-select
                v-model="sort"
                class="select-sort"
                placeholder="A-Z"
                size="small"
              >
                <el-option key="A-Z" label="A-Z" value="A-Z" />
                <el-option key="Z-A" label="Z-A" value="Z-A" />
              </el-select>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="city" label="City/Town" />

        <el-table-column fixed="right" label="" width="48">
          <template #default="scope">
            <el-tooltip
              v-if="!scope.row.loaded"
              content="В процессе"
              placement="top"
            >
              <img class="rotating" src="/img/sync.svg" alt="" />
            </el-tooltip>
            <el-tooltip
              v-else-if="scope.row.status"
              content="Успешно"
              placement="top"
            >
              <img src="/img/check.png" alt="" />
            </el-tooltip>
            <el-tooltip v-else content="Не успешно" placement="top">
              <img src="/img/times.svg" alt="" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findFlagUrlByIso2Code } from "country-flags-svg";
import { onMounted, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { copyTextToClipboard } from "~~/utils/common";
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
const router = useRouter();
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
195.16.32.228
195.16.32.229
195.16.32.220
195.16.32.230
`);
const itemStore = ref({});
const isSelectedAll = ref(false);
const sort = ref("A-Z");
const tBody = ref(null);
const totalScrolledTBody = ref(0);
const isSearchStarted = ref(false);
const searchInTableValue = ref("");
// END OF Локальные переменные

// Вычисляемые параметры
const headerRowClassName = computed(() => {
  if (!totalScrolledTBody.value) {
    return "header-row";
  }
  return "header-row shadow";
});

const tableData = computed(() => {
  return Object.values(itemStore.value);
});

const tableDataFiltered = computed(() => {
  const sortFunc =
    sort.value === "A-Z"
      ? (a, b) => a.country.toLowerCase().localeCompare(b.country.toLowerCase())
      : (a, b) =>
          b.country.toLowerCase().localeCompare(a.country.toLowerCase());

  const searchFunc = (ip) => {
    return `${ip.query}${ip.country}${ip.city}`
      .toLowerCase()
      .match(searchInTableValue.value.toLowerCase());
  };

  return [...tableData.value].sort(sortFunc).filter(searchFunc);
});

const hasTwoOrMoreSelectedItems = computed(() => {
  return tableDataFiltered.value.filter((ip) => ip.selected).length >= 2;
});
// END OF Вычисляемые параметры

// Методы
const copyToClipboard = (ip) => {
  console.log("ip", ip);
  copyTextToClipboard(ip);
};

const handleClickRow = (evt) => {
  router.push(`/ip/${evt.query}`);
};

const deleteSelected = () => {
  tableDataFiltered.value
    .filter((ip) => ip.selected)
    .forEach((ip) => {
      deleteItem(ip.query);
    });
};

const deleteItem = (ip) => {
  delete itemStore.value[ip];
};

const getItemData = async (ip) => {
  const { data, errors } = await $services.IPApi.read(ip);

  if (errors) {
    const item = {
      query: ip,
      country: "",
      city: "",
      icon: "",
      selected: false,
      loaded: true,
      status: false,
    };

    itemStore.value[item.query] = item;

    return;
  }

  const icon = findFlagUrlByIso2Code(data.countryCode);

  const item = {
    ...data,
    icon,
    selected: false,
    loaded: true,
    status: true,
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
    const item = {
      query: ip,
      country: "",
      city: "",
      icon: "",
      selected: false,
      loaded: false,
      status: false,
    };

    isSearchStarted.value = true;

    itemStore.value[item.query] = item;
  }

  for (let ip of searchValues) {
    await getItemData(ip);
  }
};
// END OF Методы

// Хуки
watch(isSelectedAll, (newValue) => {
  tableDataFiltered.value.forEach((ip) => {
    itemStore.value[ip.query].selected = newValue;
  });
});

onMounted(() => {
  tBody.value = document.querySelector(".el-scrollbar__wrap");
  console.log(" tBody.value", tBody.value);
  tBody.value.addEventListener("scroll", (evt) => {
    totalScrolledTBody.value = tBody.value.scrollTop;
  });
});
// END OF Хуки
</script>

<style>
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}
</style>

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
      width: 100%;
      border-radius: 4px;
      margin-top: 20px;

      .ip-cell {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;

        .flag-and-ip {
        }

        .action {
          &:hover {
            cursor: pointer;
          }
        }
      }

      :deep(.el-table_1_column_1) {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .country-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .select-sort {
          border: 1px solid rgba(64, 60, 247, 1);
          background: rgba(242, 240, 240, 1);
          border-radius: 4px;
          width: 64px;
          font-family: Inter;
          font-size: 13px;
          font-weight: 500;
          line-height: 20px;
          text-align: left;
          color: rgba(64, 60, 247, 1);
        }
      }

      :deep(.header-row) {
        font-family: Inter;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        text-align: left;
        color: rgba(44, 44, 44, 1);

        &.shadow {
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.12);
        }
      }

      :deep(.table-row) {
        font-family: Inter;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        text-align: left;
        color: rgba(44, 44, 44, 1);
      }

      .flag {
        width: 21px;
      }

      .ip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .button-delete {
          font-family: Inter;
          font-size: 13px;
          font-weight: 500;
          line-height: 20px;
          text-align: left;
          color: rgba(121, 25, 25, 1);
          background: rgba(248, 232, 232, 1);
          border: none;
          padding: 2px 8px;
          height: 24px;
          width: 147px;
        }
      }
    }
  }
}
</style>
