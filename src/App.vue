<template>
  <div class="App">
    <router-view />
    <van-tabbar route :placeholder="true" :safe-area-inset-bottom="true">
      <van-tabbar-item replace to="/" icon="home-o">在线挂号</van-tabbar-item>
      <van-tabbar-item replace to="/my" icon="friends"
        >我的挂号</van-tabbar-item
      >
    </van-tabbar>
    <div class="bg"></div>
  </div>
</template>
<script>
import { onBeforeMount, onBeforeUpdate, watch } from "vue";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
  name: "App",
  setup() {
    let times = null, //定时器
      ws = null,
      wsTime = 10; //重连次数;
    const store = useStore(),
      wsUrl = "wss:///hospital.longjiaming.cn/websocket";
    let wsHeart = {
      timeout: 3000, // 心跳延迟时间
      timeoutObj: null,
      serverTimeoutObj: null,
      connectTimeoutObj: null,
      lockConnect: false,
      lockConnectTimeout: 2000, // 重连延迟时间
      reSet: function () {
        wsTime = 10;
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        clearTimeout(this.connectTimeoutObj);
        this.timeoutObj = null;
        this.serverTimeoutObj = null;
        this.connectTimeoutObj = null;
      },
      reClose: function () {
        this.reSet();
        ws.close();
      },
      reStart: function () {
        this.reSet();
        this.reCheck();
      },
      reCheck: function () {
        this.timeoutObj = setTimeout(() => {
          ws.send(JSON.stringify({ code }));
          this.serverTimeoutObj = setTimeout(() => {
            this.reClose();
          }, this.timeout);
        }, this.timeout);
      },
      reConnect: function () {
        if (!this.lockConnect) {
          wsTime--;
          this.lockConnect = true;
          this.connectTimeoutObj = setTimeout(() => {
            this.newWs();
            this.lockConnect = false;
          }, this.lockConnectTimeout);
        }
      },
      newWs: function () {
        try {
          if ("WebSocket" in window && store.state.isLogin) {
            ws = new WebSocket(wsUrl);
            wsInit();
          }
        } catch (e) {
          this.reConnect();
        }
      },
    };

    function wsInit() {
      ws.onopen = function () {
        wsHeart.reStart();
        ws.send(
          JSON.stringify({ code: 201, token: localStorage.getItem("token") })
        );
      };
      ws.onmessage = function (evt) {
        wsHeart.reStart();
        let msg = JSON.parse(evt.data);
        // let msg = evt;
        // console.log(msg);
        if (msg.code === 200) {
          // console.log(msg.ranking);
          store.commit("setNowRanking", msg.ranking);
        }
        // console.log(evt);
      };
      ws.onclose = function () {
        if (wsTime > 0) {
          wsHeart.reConnect();
        } else {
          wsHeart.reClose();
        }
      };
      ws.onerror = function () {
        if (wsTime > 0) {
          wsHeart.reConnect();
        } else {
          wsHeart.reClose();
        }
      };
      window.onbeforeunload = function () {
        wsHeart.reClose();
      };
    }
    // const initWs = () => {
    //   // console.log("判断", ws == null, store.state.isLogin);
    //   if (ws == null && store.state.isLogin) {
    //     // console.log("reconnectionTimes=", reconnectionTimes);
    //     ws = new WebSocket(wsUrl);
    //     // ws = 1;
    //     store.dispatch("getMyinfo");
    //     ws.onopen = function () {
    //       times = null;
    //       console.log("当前客户端已经连接到websocket服务器");
    //       ws.send(
    //         JSON.stringify({ code: 201, token: localStorage.getItem("token") })
    //       );
    //     };
    //     ws.onmessage = function (evt) {
    //       let msg = JSON.parse(evt.data);
    //       // let msg = evt;
    //       // console.log(msg);
    //       if (msg.code === 200) {
    //         // console.log(msg.ranking);
    //         store.commit("setNowRanking", msg.ranking);
    //       }
    //       // console.log(evt);
    //     };
    //     // 关闭websocket
    //     ws.onclose = function () {
    //       // times = null;
    //       // ws = null;
    //       // if()
    //       if (store.state.isLogin && times == null) {
    //         if (wsTime === 0) {
    //           times = setInterval(() => {
    //             console.log(`第${wsTime++}次尝试重连`);
    //             ws = null;
    //             initWs();
    //           }, 1000);
    //         } else if (wsTime >= 10) {
    //           Toast("无法获取叫号信息，请检查网络并刷新网页");
    //           clearInterval(times);
    //           times = null;
    //           ws = null;
    //         }
    //       }
    //       // console.log(store.state.isLogin);
    //       console.log("连接已关闭...");
    //     };
    //     ws.onerror = function (err) {
    //       console.log(err);
    //     };
    //   }
    // };

    watch(
      () => store.state.isLogin,
      (v) => {
        if (v) {
          // console.log("Login");
          wsHeart.newWs();
        } else {
          ws !== null ? ws.close() : false;
          ws = null;
        }
      }
    );
    onBeforeMount(() => {
      wsHeart.newWs();
      store.dispatch("getMyinfo");
    });
  },
};
</script>
<style>
.bg {
  width: 100vw;
  height: 100vh;
  background-color: #f8f8fa;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
}
.App {
  position: relative;
}
</style>
