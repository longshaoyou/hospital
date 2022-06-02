<template>
  <div>
    <van-nav-bar
      :title="'医师：' + doctorInfo.doctor.name"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-divider>{{ "时间：" + doctorInfo.selectionTime }}</van-divider>
    <van-cell-group inset v-for="time of doctorTimeList" :key="time.id">
      <van-cell :title="`时间:${time.time}`">
        <template #extra>
          <van-button
            v-if="time.state"
            round
            type="primary"
            @click="confirmReg(time)"
            >可预约</van-button
          >
          <van-button v-else round disabled type="warning">已约满</van-button>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script setup>
import { reactive, onUnmounted, onMounted } from "vue";
import router from "@/router";
import { Dialog, Notify, Toast } from "vant";
import { useStore } from "vuex";
import axios from "@/api";
const store = useStore();
const doctorInfo = {
  ...router.currentRoute.value.params,
  ...JSON.parse(localStorage.getItem("doctorInfo")),
};
// console.log(doctorInfo);
for (const key in doctorInfo) {
  if (typeof doctorInfo[key] === "string" && key !== "selectionTime") {
    // console.log(doctorInfo[key]);
    doctorInfo[key] = JSON.parse(doctorInfo[key]);
  }
}
// console.log(doctorInfo);
const doctorTimeList = reactive([]);
localStorage.setItem("doctorInfo", JSON.stringify(doctorInfo));
//方法
const confirmReg = (time) => {
  const { registeredInfo } = store.state;
  if (registeredInfo.isRegistered) {
    Notify("你已预约");
  } else {
    Dialog.confirm({
      message: "是否确认预约？",
    })
      .then(() => {
        // on confirm
        const { timeId } = time;
        // console.log("确认");

        axios
          .post("/reserve", {
            doctorID: doctorInfo.doctor.id,
            timeId,
            day: doctorInfo.selectionTime,
          })
          .then((v) => {
            if (v.data.code === 200) {
              store.dispatch("getMyinfo");
              Toast("挂号成功");
              router.push("/my");
            }
            // console.log(v);
          });
      })
      .catch(() => {});
  }
};
const onClickLeft = () => router.back();
//请求医生时间
const getDoctorTimeList = async () => {
  let result = await axios.post("/get/doctorTimeList", {
    doctorID: doctorInfo.doctor.id,
    day: doctorInfo.selectionTime,
  });
  result.data.data.doctorTimeList.forEach((e) => {
    doctorTimeList.push(e);
  });
  // console.log(result);
};
onMounted(() => getDoctorTimeList());
onUnmounted(() => localStorage.removeItem("doctorInfo"));
</script>

<style scoped>
.van-cell-group {
  margin-top: 30px;
}
</style>
