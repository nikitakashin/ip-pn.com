// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@element-plus/nuxt"],

  elementPlus: {
    /** Options */
  },

  plugins: ["~/plugins/axios.js", "~/plugins/api.js"],

  css: ["assets/global.css"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/main.scss";',
        },
      },
    },
  },

  alias: {
    "~/*": "./*",
    "@/*": "./*",
  },

  devtools: { enabled: true },
});
