import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

import zhCN from './zh-CN';
import enUS from './en-US';
import type { AppLocale } from '@/types/app';

export const defaultLocale: AppLocale = 'zh-CN';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      'en-US': { translation: enUS },
    },
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false, // React 已经自带 XSS 转义防范
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'app_locale',
      caches: ['localStorage'],
    },
  });

// 动态同步 Dayjs 语言
export const syncDayjsLocale = (locale: AppLocale) => {
  if (locale === 'zh-CN') {
    dayjs.locale('zh-cn');
  } else {
    dayjs.locale('en');
  }
};

syncDayjsLocale((i18n.language as AppLocale) || defaultLocale);

export default i18n;
