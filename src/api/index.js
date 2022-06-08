import axios from "axios";
import { Notify, Toast } from "vant";
import router from "@/router";
axios.defaults.baseURL = "/api";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

axios.interceptors.request.use((config) => {
  if (localStorage.getItem("token")) {
    config.headers.Authorization = "Bearer " + localStorage.getItem("token");
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      Toast(response.data.msg);
    } else if (response.data.code === 400) {
      Toast("遇到错误");
    }
    return response;
  },
  (err) => {
    // Object.keys(err).for
    // for (let item in err) {
    //   console.log(item, err[item]);
    // }
    if (err) {
      err = err.toJSON();
      let { message, status } = err;
      if (err.status == 401) {
        Toast("登录已过期");
        console.log(router);
        router.push("/login");
        localStorage.removeItem("token");
      } else {
        Toast("网络错误，请重试");
      }
    }

    return Promise.reject(err?.message);
  }
);

export default axios;
