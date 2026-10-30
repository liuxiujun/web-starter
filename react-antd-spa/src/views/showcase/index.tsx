import {
  theme as antdTheme,
  App as AntdApp,
  Card,
  Button,
  Space,
  Typography,
  DatePicker,
  Select,
} from "antd";
import { useAppStore } from "@/stores/app";
import { SunOutlined, MoonOutlined, GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

export function ShowcaseContent() {
  const { t } = useTranslation();
  const { token } = antdTheme.useToken();
  const { message, modal } = AntdApp.useApp();

  const themeMode = useAppStore((s) => s.settings.theme);
  const locale = useAppStore((s) => s.settings.locale);
  const setTheme = useAppStore((s) => s.setTheme);
  const setLocale = useAppStore((s) => s.setLocale);

  const toggleTheme = () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setTheme(next);
    message.success(
      next === "dark" ? t("settings.darkTheme") : t("settings.lightTheme"),
    );
  };

  const toggleLocale = () => {
    const next = locale === "zh-CN" ? "en-US" : "zh-CN";
    setLocale(next);
    message.info(next === "zh-CN" ? "已切换至简体中文" : "Switched to English");
  };

  const handleOpenModal = () => {
    modal.confirm({
      title: t("common.confirm"),
      content: t("login.subtitle"),
    });
  };

  return (
    <div
      style={{
        padding: 48,
        minHeight: "100vh",
        backgroundColor: token.colorBgContainer,
      }}
    >
      <Space
        direction="vertical"
        size="large"
        style={{
          width: "100%",
          maxWidth: 800,
          margin: "0 auto",
          display: "flex",
        }}
      >
        <Card
          variant="outlined"
          style={{ borderColor: token.colorBorderSecondary }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title
              level={2}
              style={{ margin: 0, color: token.colorTextHeading }}
            >
              {t("login.subtitle")}
            </Title>
            <Paragraph type="secondary">
              阶段 2 就绪验证：Zustand 响应式持久化 + AntD 5 Design Token
              动态主题 + React-i18next 端到端国际化。
            </Paragraph>

            <Space wrap>
              <Button
                type="primary"
                icon={themeMode === "dark" ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
              >
                {themeMode === "dark"
                  ? t("settings.lightTheme")
                  : t("settings.darkTheme")}
              </Button>

              <Button icon={<GlobalOutlined />} onClick={toggleLocale}>
                {locale === "zh-CN" ? "English" : "简体中文"}
              </Button>

              <Button onClick={handleOpenModal}>
                {t("common.confirm")} (Modal 测试)
              </Button>
            </Space>

            <div style={{ marginTop: 16 }}>
              <Space wrap>
                <DatePicker />
                <Select
                  defaultValue="active"
                  style={{ width: 140 }}
                  options={[
                    { value: "active", label: t("status.active") },
                    { value: "inactive", label: t("status.inactive") },
                    { value: "pending", label: t("status.pending") },
                  ]}
                />
              </Space>
            </div>

            <Card size="small" type="inner" title="Design Token 实时取色验证">
              <Space direction="vertical">
                <Text>
                  token.colorPrimary: <Text code>{token.colorPrimary}</Text>
                </Text>
                <Text>
                  token.colorBgContainer:{" "}
                  <Text code>{token.colorBgContainer}</Text>
                </Text>
                <Text>
                  token.colorText: <Text code>{token.colorText}</Text>
                </Text>
              </Space>
            </Card>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
