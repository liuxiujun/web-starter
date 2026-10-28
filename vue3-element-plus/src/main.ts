import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";
import router from "./router";
import i18n from "./locales";
import { useAppStore } from "./stores/app";

async function prepareApp() {
  // 只在本地开发环境动态加载并启动 MSW
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    // 拦截未匹配的请求自动放行，不打扰 vite 自身的资源加载
    await worker.start({ onUnhandledFrame: "bypass" });
  }
}

const app = createApp(App);

// 全局注册所有 Element Plus 图标组件（如 <User />、<Search /> 等）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const pinia = createPinia();
app.use(pinia);
// 初始化全局应用状态与主题
useAppStore();
app.use(ElementPlus);
app.use(router);
app.use(i18n);

// 确保 MSW Worker 启动就绪后再挂载 Vue 应用，杜绝首屏请求漏网
prepareApp().then(() => {
  // 挂载到 DOM 容器
  app.mount("#app");
});
