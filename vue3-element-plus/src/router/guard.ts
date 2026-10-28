import type { Router } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const WHITE_LIST = ["/login", "/404"];

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    // 1. 已登录用户
    if (authStore.isAuthenticated) {
      if (to.path === "/login") {
        return "/"; // 防止倒流进登录页
      }

      // 💡 关键自愈机制：如果已登录但在内存中缺失个人资料（如刷新 F5），主动拉取接口
      if (!authStore.userInfo) {
        try {
          await authStore.fetchUserInfo();
        } catch {
          authStore.logout();
          return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
        }
      }

      return true;
    }

    // 2. 未登录用户访问白名单页面
    if (WHITE_LIST.includes(to.path)) {
      return true;
    }

    // 3. 未登录且访问受保护页面：拦截并重定向携带来源
    return `/login?redirect=${encodeURIComponent(to.fullPath)}`;
  });
}
