import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Layout from "@/layout/index.vue";
import { setupRouterGuard } from "./guard";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/users", // 访问根路径自动重定向到用户中心
    children: [
      {
        path: "users",
        name: "UserManagement",
        component: () => import("@/views/user/index.vue"),
        meta: { title: "menu.users" },
      },
      {
        path: "settings",
        name: "SystemSettings",
        component: () => import("@/views/settings/index.vue"),
        meta: { title: "menu.settings" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupRouterGuard(router)

export default router;
