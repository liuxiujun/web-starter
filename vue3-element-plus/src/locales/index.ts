import { createI18n } from "vue-i18n";
import zhCN from "./lang/zh-CN";
import enUS from "./lang/en-US";

export type AppLocale = "zh-CN" | "en-US";

const LOCALE_STORAGE_KEY = "app_locale";

/**
 * 智能探测系统语言：
 * 优先级 1: localStorage 用户曾手动保存的偏好
 * 优先级 2: navigator.language 浏览器当前系统环境 (如 en-US, zh-HK, zh-TW 等)
 * 优先级 3: 默认兜底 zh-CN
 */
export const getInitialLocale = (): AppLocale => {
  // 1. 读取本地存储
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as AppLocale | null;
  if (saved === "zh-CN" || saved === "en-US") {
    return saved;
  }
  // 2. 智能前缀探测浏览器环境
  // 浏览器语言格式可能为: 'zh-CN' | 'zh-TW' | 'zh' | 'en-US' | 'en-GB'
  const browserLang = (navigator.language || "").toLowerCase();
  if (browserLang.startsWith("zh")) {
    return "zh-CN";
  }
  if (browserLang.startsWith("en")) {
    return "en-US";
  }
  // 3. 默认兜底
  return "zh-CN";
};
/**
 * 切换语言并持久化
 */
export const saveLocalePreference = (lang: AppLocale) => {
  localStorage.setItem(LOCALE_STORAGE_KEY, lang);
};
const i18n = createI18n({
  // 必须设置为 false，全面启用 Vue 3 组合式 API (useI18n)
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: "zh-CN",
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});
export default i18n;
