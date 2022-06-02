<template>
  <div class="my">
    <van-nav-bar
      title="我的挂号"
      right-text="注销账号"
      @click-right="signOut"
    />
    <MyPersonalCenter />
    <MyQueueUpInfo />
  </div>
</template>

<script setup>
// @ is an alias to /
// import { reactive } from "vue";
import { Dialog } from "vant";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
import MyPersonalCenter from "@/components/MyPersonalCenter";
import MyQueueUpInfo from "@/components/MyQueueUpInfo";
const router = useRouter();
const signOut = () => {
  Dialog.confirm({
    message: "是否确定退出？",
  })
    .then(() => {
      // on confirm
      store.commit("login", false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("token");
      router.replace({ name: "login" });
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>
