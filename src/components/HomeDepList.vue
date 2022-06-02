<template>
  <div>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="department in departmentList"
        :key="department.id"
        :title="department.name"
        :to="{
          name: 'doctorList',
          params: { id: department.id, name: department.name },
        }"
        is-link
      />
    </van-list>
  </div>
</template>

<script setup>
// @ is an alias to /src
import { ref, reactive } from "vue";
import axios from "@/api";
let loading = ref(false);
let finished = ref(false);
let departmentList = reactive([]);
let page = 0;
const onLoad = async (value) => {
  let result = await axios.post("/get/departmentList", { page });
  if (result.data.data.isFinish) {
    finished.value = true;
  }
  result.data.data.departmentList.forEach((e) => {
    departmentList.push(e);
  });
  loading.value = false;
  page++;
};
</script>
