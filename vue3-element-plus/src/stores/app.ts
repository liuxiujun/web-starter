import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import i18n, { type AppLocale, getInitialLocale } from "@/locales";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

export type AppTheme = "light" | "dark";

// 全局应用设置强类型契约（消除数据泥团 Data Clump）
export interface AppSettings {
  systemName: string;
  theme: AppTheme;
  locale: AppLocale;
}

const SYSTEM_NAME_KEY = "app_system_name";
const THEME_KEY = "app_theme";
const LOCALE_KEY = "app_locale";

export const useAppStore = defineStore("app", () => {
  // 1. 系统名称
  const systemName = ref(
    localStorage.getItem(SYSTEM_NAME_KEY) || "Web Starter",
  );

  // 2. 主题模式
  const getInitialTheme = (): AppTheme => {
    const saved = localStorage.getItem(THEME_KEY) as AppTheme | null;
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const theme = ref<AppTheme>(getInitialTheme());

  const applyThemeToDOM = (mode: AppTheme) => {
    const html = document.documentElement;
    if (mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  // 3. 多语言状态（统一收敛纳管，通用语言统一为 locale）
  const locale = ref<AppLocale>(getInitialLocale());

  // 桥接计算 Element Plus 组件库官方语言包
  const epLocale = computed(() => (locale.value === "en-US" ? en : zhCn));

  // 🛡️ 响应式自动同步（消除散弹式修改）：
  watch(
    systemName,
    (val) => {
      localStorage.setItem(SYSTEM_NAME_KEY, val);
      document.title = `${val} | Platform`;
    },
    { immediate: true },
  );

  watch(
    theme,
    (mode) => {
      localStorage.setItem(THEME_KEY, mode);
      applyThemeToDOM(mode);
    },
    { immediate: true },
  );

  watch(
    locale,
    (val) => {
      localStorage.setItem(LOCALE_KEY, val);
      // 同步驱动底层 vue-i18n 响应式引擎
      (i18n.global.locale as any).value = val;
    },
    { immediate: true },
  );

  // 单属性快捷操作器（供 Header 快捷切换等场景使用）
  const setSystemName = (name: string) => {
    systemName.value = name;
  };

  const setTheme = (mode: AppTheme) => {
    theme.value = mode;
  };

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  };

  const setLocale = (lang: AppLocale) => {
    locale.value = lang;
  };

  // 🛡️ 聚合型领域 Action（解决数据泥团与非原子更新）：整体保存应用配置
  const updateSettings = (data: Partial<AppSettings>) => {
    if (data.systemName !== undefined) systemName.value = data.systemName;
    if (data.theme !== undefined) theme.value = data.theme;
    if (data.locale !== undefined) locale.value = data.locale;
  };

  return {
    systemName,
    setSystemName,
    theme,
    setTheme,
    toggleTheme,
    locale,
    epLocale,
    setLocale,
    updateSettings,
  };
});
