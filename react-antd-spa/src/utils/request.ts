import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { message } from "antd";
import { useAppStore } from "@/stores/app";
import i18n from "@/locales";

export const TOKEN_STORAGE_KEY = "auth_token";

const service = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const currentLocale = useAppStore.getState().settings.locale || "zh-CN";
    if (config.headers) {
      config.headers["Accept-Language"] = currentLocale;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：纯 RESTful 解包与统一异常收敛
service.interceptors.response.use(
  (response) => {
    // 核心契约：HTTP 2xx 直出资源，脱掉 Axios 壳
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const defaultMsg = i18n.t("api.networkError");
    const errorMsg =
      error.response?.data?.message || error.message || defaultMsg;

    if (status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      const sessionExpiredMsg =
        error.response?.data?.message || i18n.t("api.sessionExpired");
      message.error(sessionExpiredMsg);

      if (window.location.pathname !== "/login") {
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        window.location.href = `/login?redirect=${redirect}`;
      }
    } else {
      message.error(errorMsg);
    }

    return Promise.reject(error);
  },
);

// 强化 TypeScript 类型签名：让 request.get<T>() 直接返回 Promise<T>
export interface CustomAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
}

export const request = service as CustomAxiosInstance;
export default request;
