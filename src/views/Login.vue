<template>
  <div class="login">
    <van-nav-bar title="医院挂号系统登录" />
    <van-form class="loginForm" @submit="onSubmit">
      <div class="loginImg">
        <van-image
          width="100"
          height="100"
          :src="`${publicPath}loginImg.jpeg`"
        />
      </div>
      <van-cell-group inset>
        <van-field
          v-model="formData.username"
          name="姓名"
          label="姓名"
          placeholder="姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
      </van-cell-group>
      <van-cell-group inset>
        <van-field
          v-model="formData.id"
          name="身份证"
          label="身份证"
          placeholder="身份证"
          :rules="[
            { required: true, message: '请填写身份证' },
            { validator: isID, message: '请填写正确的身份证号' },
          ]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <div class="switchMode">
          <van-button type="primary" size="mini" to="register"
            >前往注册</van-button
          >
        </div>
        <van-button
          class="loginButton"
          round
          block
          :loading="isLoading"
          type="primary"
          native-type="submit"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import router from "@/router";
import { useStore } from "vuex";
import axios from "@/api";
const formData = reactive({ username: "", id: "" });
const store = useStore();
let publicPath = process.env.BASE_URL;
let isLoading = ref(false);
const isID = (id) =>
  /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/.test(
    id
  );
const onSubmit = async () => {
  isLoading.value = true;
  try {
    let login = await axios({
      url: "/login",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      method: "POST",
      data: { ...formData },
    });
    if (login.data.code === 401) {
      isLoading.value = false;
      return;
    }
    store.commit("login", true);
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("token", login.data.data.token);
    store.dispatch("getMyinfo"); //获取个人信息
    router.push("/");
    isLoading.value = false;
    // console.log(login);
  } catch (err) {
    console.error(err);
    isLoading.value = false;
  }
};
</script>

<style scoped>
.loginForm {
  margin-top: 30px;
}
.van-cell-group,
.loginButton {
  margin-top: 30px;
}
.loginImg {
  width: 100%;
  display: grid;
  place-items: center;
}
.switchMode {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
