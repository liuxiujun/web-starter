import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { TOKEN_KEY } from "@/utils/request";
import { loginApi, getMeApi } from "@/api/auth";
import type { LoginCredentials } from "@/types/auth";
import type { UserItem } from "@/types/user";

export const USER_INFO_KEY = "auth_user_info";

const getSavedUserInfo = (): UserItem | null => {
  try {
    const raw = localStorage.getItem(USER_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const userInfo = ref<UserItem | null>(getSavedUserInfo());

  const isAuthenticated = computed(() => Boolean(token.value));

  // 🛡️ 响应式自动同步（消除散弹式修改）：状态变化自动持久化到本地
  watch(token, (val) => {
    if (val) {
      localStorage.setItem(TOKEN_KEY, val);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  });

  watch(
    userInfo,
    (val) => {
      if (val) {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(val));
      } else {
        localStorage.removeItem(USER_INFO_KEY);
      }
    },
    { deep: true },
  );

  const login = async (credentials: LoginCredentials) => {
    const res = await loginApi(credentials);
    // 纯粹的领域状态赋值，无需再手动调用 localStorage.setItem！
    token.value = res.token;
    userInfo.value = res.user;
  };

  const fetchUserInfo = async () => {
    if (!token.value) return;
    try {
      const data = await getMeApi();
      userInfo.value = data;
      return data;
    } catch {
      logout();
    }
  };

  const logout = () => {
    // 赋值为 null 后，上面的 watch 自动同步清理 localStorage！
    token.value = null;
    userInfo.value = null;
  };

  return { token, userInfo, isAuthenticated, login, logout, fetchUserInfo };
});
