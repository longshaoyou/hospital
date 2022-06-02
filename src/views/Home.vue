<template>
  <div class="home">
    <van-search
      v-model="searchVale"
      placeholder="搜索医生"
      @search="onSearch"
    />
    <DepartmentList />
  </div>
</template>

<script setup>
// @ is an alias to /src
import { ref } from "vue";
import DepartmentList from "@/components/HomeDepList";
let searchVale = ref("");
localStorage.removeItem("DInfo");
function onSearch() {}
</script>
<style scoped></style>
