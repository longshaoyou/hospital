<template>
  <div class="MyPersonalCenter">
    <van-divider>个人信息</van-divider>
    <van-cell-group inset>
      <van-cell :title="myInfo.name" :label="'就诊卡号：' + myInfo.id" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
const myInfo = computed(() => store.state.myInfo);
// @ is an alias to /src
// const myInfo = reactive({ name: "李丙",id:"158315" });
</script>

<script>
export default {
  name: "personalCenter",
};
</script>
