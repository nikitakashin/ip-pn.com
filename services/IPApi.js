export const IPApi = ($axios) =>
  class IPApi {
    static read = (ip) => {
      return $axios.$get(`/${ip}`, {});
    };
  };
