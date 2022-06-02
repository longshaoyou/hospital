<template>
  <div class="DepartmentInfo">
    <van-nav-bar
      :title="deartmentInfo.name"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-tabs v-model:active="active" @rendered="getdoctorList">
      <van-tab v-for="time in selectionTime" :key="time" :title="time">
        <div v-if="!doctorList[time]?.length" class="listLoading">
          <van-loading size="24px" vertical>加载中...</van-loading>
        </div>
        <div v-else>
          <van-cell-group
            inset
            v-for="doctor in doctorList[time]"
            :key="doctor.id"
          >
            <van-cell :title="doctor.name" :label="doctor.leval">
              <template #icon>
                <van-image
                  round
                  width="50px"
                  height="50px"
                  class="doctorImg"
                  :src="doctor.imgPath"
                />
              </template>
              <template #extra>
                <van-button
                  v-if="doctor.state"
                  round
                  type="primary"
                  @click="GotoReservation(doctor)"
                  >可预约</van-button
                >
                <van-button v-else round disabled type="warning"
                  >已约满</van-button
                >
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import axios from "@/api";
import {
  ref,
  reactive,
  onUnmounted,
  toRaw,
  toRefs,
  unref,
  onMounted,
} from "vue";
import router from "@/router";
// console.log(router.currentRoute.value.params);
//读取参数
const deartmentInfo = reactive({
  id: router.currentRoute.value.params.id,
  name: router.currentRoute.value.params.name,
  ...JSON.parse(localStorage.getItem("DInfo")),
});
// console.log(deartmentInfo);

// console.log(JSON.parse(localStorage.getItem("DInfo")).id);
localStorage.setItem(
  "DInfo",
  JSON.stringify({
    id: deartmentInfo.id,
    name: deartmentInfo.name,
  })
);
onMounted(() => {
  getdoctorList();
});
let active = ref(0);
let selectionTime = [];
let now = new Date();
for (let i = 0; i < 7; i++) {
  let time = new Date(+now + i * 24 * 60 * 60 * 1000);
  selectionTime.push(
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate()
  );
}
const doctorList = reactive({});
//方法
const GotoReservation = (doctor) => {
  router.push({
    name: "doctorTime",
    params: {
      deartmentInfo: JSON.stringify(deartmentInfo),
      doctor: JSON.stringify(doctor),
      selectionTime: selectionTime[unref(active)],
    },
  });
};
// 获取医生列表
const getdoctorList = async () => {
  let result = await axios.post("/get/doctorList", {
    departmentID: deartmentInfo.id,
    day: selectionTime[unref(active)],
  });
  doctorList[selectionTime[unref(active)]] = [];
  result.data.data.doctorList.forEach((e) => {
    doctorList[selectionTime[unref(active)]].push(e);
  });
  // console.log(result);
};
//退出
const onClickLeft = () => {
  history.back();
  localStorage.removeItem("DInfo");
};
</script>

<style scoped>
.van-cell-group {
  margin-top: 30px;
}
.doctorImg {
  margin-right: 10px;
}

.listLoading {
  width: 100vw;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
