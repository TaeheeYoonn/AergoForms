"use strict";

import Vue from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
let token = sessionStorage.getItem("af-token");
if (token != null) {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + sessionStorage.getItem("af-token");
}

let config = {
  baseURL: process.env.baseURL || process.env.apiUrl || "http://localhost:5000"
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status === 401 || error.response.status === 422) {
      _axios.defaults.headers.common["Authorization"] = null;
      sessionStorage.removeItem("af-token");
      sessionStorage.removeItem("af-id");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;