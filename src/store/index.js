import { createStore } from "vuex";
import axios from "@/api";
export default createStore({
  state: {
    isLogin: JSON.parse(localStorage.getItem("isLogin")) || false,
    myInfo: {
      name: "",
      id: "",
    },
    registeredInfo: {
      isRegistered: false, //是否挂号
      isTimeUp: false, //是否是当天
      ranking: -1, //排队号,
      nowRanking: -1,
      doctorInfo: {}, //医生信息
      time: {}, //挂号时间
    },
  },
  getters: {},
  mutations: {
    isRegister(state, isRegistered = false, isTimeUp = false, rankingInfo = {}, doctorInfo = {}, time = {}) {
      state.registeredInfo.isRegistered = isRegistered;
      if (isRegistered === true) {
        state.registeredInfo.isTimeUp = isTimeUp;
        state.registeredInfo.rankingInfo = rankingInfo;
        state.registeredInfo.doctorInfo = doctorInfo;
        state.registeredInfo.time = time;
      }
    },
    login(state, boolen) {
      state.isLogin = boolen;
    },
    setMyInfo(state, data) {
      // console.log(data);
      state.myInfo.name = data.myInfo.name;
      state.myInfo.id = data.myInfo.id;
      state.registeredInfo.isRegistered = data.registeredInfo.isRegistered;
      state.registeredInfo.isTimeUp = data.registeredInfo.isTimeUp;
      state.registeredInfo.ranking = data.registeredInfo.ranking;
      state.registeredInfo.doctorInfo = data.registeredInfo.doctorInfo;
      state.registeredInfo.time = data.registeredInfo.time;
    },
    setNowRanking(state, ranking) {
      state.registeredInfo.nowRanking = ranking;
    },
  },
  actions: {
    async getMyinfo(context) {
      try {
        let result = await axios.get("get/myInfo");
        if (result.data.code === 200) {
          context.commit("setMyInfo", result.data.data);
        }
        // console.log(result);
      } catch (err) {}
    },
  },
  modules: {},
});
