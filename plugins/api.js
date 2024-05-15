import { defineNuxtPlugin } from "nuxt/app";
import { IPApi } from "~~/services/IPApi";

export default defineNuxtPlugin((nuxtApp) => {
  if (!nuxtApp.$axios) {
    console.error("Плагин Axios не установлен, работа с API Не доступна");
    return;
  }

  const axios = nuxtApp.$axios;

  return {
    provide: {
      services: {
        IPApi: IPApi(axios),
      },
    },
  };
});
