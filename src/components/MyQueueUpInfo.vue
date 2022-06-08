<template>
  <div class="myQuqueUpInfo">
    <div v-if="registeredInfo.isRegistered">
      <van-divider>挂号时间</van-divider>
      <van-cell-group inset class="timeGoup">
        <van-cell
          :title="`日期: ${registeredInfo.time.day}`"
          :value="registeredInfo.time.time"
        />
      </van-cell-group>
      <van-divider>挂号信息</van-divider>
      <van-cell-group inset>
        <div v-if="registeredInfo.isTimeUp">
          <van-cell :title="`部门：${registeredInfo.doctorInfo.department}`" />
          <van-cell :title="`科室：${registeredInfo.doctorInfo.section}`" />
          <van-cell :title="`医师：${registeredInfo.doctorInfo.name}`" />
          <van-cell :title="`当前排到：${registeredInfo.nowRanking}`" />
          <van-cell :title="`您的号码：${registeredInfo.ranking}`" />
          <van-button @click="CancelRegistration" type="warning"
            >取消挂号</van-button
          >
        </div>
        <div v-else>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-button @click="CancelRegistration" type="warning"
            >取消挂号</van-button
          >
          <div class="topOverlay noTimeUp">
            <van-button class="tipsButton" type="warning">未到时间</van-button>
          </div>
        </div>
      </van-cell-group>
    </div>
    <div v-else>
      <van-divider>挂号时间</van-divider>
      <van-cell-group inset class="timeGoup">
        <van-cell><van-skeleton :row="1" /></van-cell>
      </van-cell-group>
      <van-divider>挂号信息</van-divider>
      <van-cell-group inset>
        <div>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
          <van-cell><van-skeleton :row="1" /></van-cell>
        </div>
      </van-cell-group>
      <div class="topOverlay">
        <van-button class="tipsButton" type="warning" to="/"
          >您未挂号，点击前去挂号</van-button
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { Dialog } from "vant";
import { useStore } from "vuex";
import axios from "@/api";
const store = useStore();
const registeredInfo = computed(() => {
  return store.state.registeredInfo;
});
function CancelRegistration() {
  Dialog.confirm({
    message: "是否确定取消挂号？",
  })
    .then(() => {
      // on confirm
      axios.get("/cancelReserve").then((data) => {
        // console.log(data);
        if (data.data.code == 200) {
          location.reload();
        }
      });
    })
    .catch(() => {});
}
</script>

<style scoped>
.myQuqueUpInfo {
  position: relative;
}
.van-button {
  width: 100%;
}
.van-cell-group {
  position: relative;
}
.van-skeleton {
  height: 24px;
}
.topOverlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.noTimeUp {
  height: 83.33%;
}
.tipsButton {
  width: 50%;
}
</style>
