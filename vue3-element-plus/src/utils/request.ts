import router from "@/router";
import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import i18n from "@/locales";

export const TOKEN_KEY = "auth_token";

const service = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 优先读取当前活跃的 vue-i18n 语言，兜底读取本地存储
    const currentLocale =
      (i18n.global.locale as any).value ||
      localStorage.getItem("app_locale") ||
      "zh-CN";
    if (config.headers) {
      config.headers["Accept-Language"] = currentLocale;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const defaultMsg = String(i18n.global.t("api.networkError"));
    const message = error.response?.data?.message || error.message || defaultMsg;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // 优先展示服务端/MSW通过 Accept-Language 返回的国际化消息，没有则读取本地国际化兜底
      const sessionExpiredMsg =
        error.response?.data?.message || String(i18n.global.t("api.sessionExpired"));
      ElMessage.error(sessionExpiredMsg);

      const currentPath = router.currentRoute.value.fullPath;
      if (currentPath !== "/login") {
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    } else {
      ElMessage.error(message);
    }
    return Promise.reject(error);
  },
);

export default service;
