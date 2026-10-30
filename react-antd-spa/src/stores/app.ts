import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import i18n, { syncDayjsLocale } from "@/locales";
import type { AppLocale, AppSettings, AppTheme } from "@/types/app";

interface AppState {
  settings: AppSettings;
  setTheme: (theme: AppTheme) => void;
  setLocale: (locale: AppLocale) => void;
  setSystemName: (name: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const applyThemeToDOM = (theme: AppTheme) => {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
    html.style.backgroundColor = "#141414";
    html.style.colorScheme = "dark";
  } else {
    html.classList.remove("dark");
    html.style.backgroundColor = "#ffffff";
    html.style.colorScheme = "light";
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: {
        systemName: "Web Starter",
        theme: (function () {
          // 优先检测系统偏好
          return typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        })(),
        locale: "zh-CN",
      },

      setTheme: (theme: AppTheme) => {
        applyThemeToDOM(theme);
        set({
          settings: {
            ...get().settings,
            theme,
          },
        });
      },

      setLocale: (locale: AppLocale) => {
        i18n.changeLanguage(locale);
        syncDayjsLocale(locale);
        set({
          settings: {
            ...get().settings,
            locale,
          },
        });
      },

      setSystemName: (systemName: string) => {
        set({
          settings: {
            ...get().settings,
            systemName,
          },
        });
      },

      updateSettings: (partial: Partial<AppSettings>) => {
        const current = get().settings;
        const next = { ...current, ...partial };
        if (partial.theme) {
          applyThemeToDOM(partial.theme);
        }
        if (partial.locale) {
          i18n.changeLanguage(partial.locale);
          syncDayjsLocale(partial.locale);
        }
        set({ settings: next });
      },
    }),
    {
      name: "app_storage", // 严格对齐 index.html 的 Anti-FOUC 键名
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // 水合恢复完成后，同步一次 DOM 标识
        if (state?.settings?.theme) {
          applyThemeToDOM(state.settings.theme);
        }
        if (state?.settings?.locale) {
          i18n.changeLanguage(state.settings.locale);
          syncDayjsLocale(state.settings.locale);
        }
      },
    },
  ),
);
