import axios from "axios";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  axios.defaults.baseURL = "http://ip-api.com/json/";

  axios.defaults.headers.post["Content-Type"] = "application/json";

  const useOpts = (opts) => {
    const body = opts?.body ? opts.body : {};
    const params = opts?.params ? { params: opts?.params } : {};

    return { body, params };
  };

  const axiosPlugin = {
    async $get(url, opts) {
      const { params } = useOpts(opts);

      try {
        const response = await axios.get(url, {
          ...params,
          withCredentials: true,
        });

        if (response.status == 200) {
          return {
            errors: null,
            data: response.data,
          };
        }

        return {
          errors: response.statusText,
          data: null,
        };
      } catch (error) {
        console.error(error);

        return {
          errors: error,
          data: null,
        };
      }
    },
  };

  return {
    provide: {
      axios: axiosPlugin,
    },
  };
});
