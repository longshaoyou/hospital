import { createRouter, createWebHistory } from "vue-router";
import { Toast } from "vant";
const routes = [
  {
    path: "/",
    name: "home",
    meta: { needLogin: true },
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/my",
    name: "my",
    meta: { needLogin: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/My.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: { needLogin: false },
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/doctorList",
    name: "doctorList",
    meta: { needLogin: true },
    component: () => import("@/views/DepartmentInfo.vue"),
    props: true,
  },
  {
    path: "/doctorTime",
    name: "doctorTime",
    meta: { needLogin: true },
    component: () => import("@/views/DoctorTimeList.vue"),
    props: true,
  },
  {
    path: "/register",
    name: "register",
    meta: { needLogin: false },
    component: () => import("@/views/Register.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.needLogin && !localStorage.getItem("token")) {
    next({ name: "login" });
    Toast.fail("未登录\n请先登录");
  } else if ((to.name === "login" || to.name === "register") && localStorage.getItem("token")) {
    next({ name: "home" });
    Toast("已登录");
  } else {
    next();
  }
});
export default router;
