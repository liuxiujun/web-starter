import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { useAppStore } from "@/stores/app";
import { ShowcaseContent } from "@/views/showcase";

export function App() {
  const themeMode = useAppStore((s) => s.settings.theme);
  const locale = useAppStore((s) => s.settings.locale);

  const antdLocale = locale === "zh-CN" ? zhCN : enUS;

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        algorithm:
          themeMode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <ShowcaseContent />
      </AntdApp>
    </ConfigProvider>
  );
}
