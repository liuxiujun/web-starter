export type AppTheme = "light" | "dark";
export type AppLocale = "zh-CN" | "en-US";

export interface AppSettings {
  systemName: string;
  theme: AppTheme;
  locale: AppLocale;
}
