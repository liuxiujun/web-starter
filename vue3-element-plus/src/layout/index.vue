<template>
  <el-container class="layout-container">
    <!-- 1. 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <div class="logo-box">
        <el-icon :size="22" color="#409eff"><Platform /></el-icon>
        <span v-show="!isCollapse" class="logo-title">{{
          appStore.systemName
        }}</span>
      </div>
      <el-menu
        :default-active="$route.path"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#001529"
        text-color="#a6adb4"
        active-text-color="#ffffff"
        class="aside-menu"
      >
        <!-- index 属性直接对应路由 path -->
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>{{ t("menu.users") }}</template>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>{{ t("menu.settings") }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 2. 右侧主体区域 -->
    <el-container class="layout-body">
      <!-- 顶部 Header -->
      <el-header height="54px" class="layout-header">
        <div class="header-left">
          <!-- 展开/收起切换按钮 -->
          <el-icon class="collapse-icon" @click="isCollapse = !isCollapse">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ t("menu.dashboard") }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{
              t(String($route.meta.title))
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- 暗黑/明亮模式快捷切换器 -->
          <el-tooltip
            :content="
              appStore.theme === 'dark'
                ? t('settings.lightTheme')
                : t('settings.darkTheme')
            "
            placement="bottom"
          >
            <el-button size="small" circle text @click="appStore.toggleTheme">
              <el-icon :size="16">
                <Sunny v-if="appStore.theme === 'dark'" />
                <Moon v-else />
              </el-icon>
            </el-button>
          </el-tooltip>

          <!-- 语言切换器 -->
          <el-dropdown @command="handleLangChange">
            <el-button size="small" text>
              🌐 {{ appStore.locale === "zh-CN" ? "简体中文" : "English" }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN" :disabled="appStore.locale === 'zh-CN'"
                  >简体中文</el-dropdown-item
                >
                <el-dropdown-item command="en-US" :disabled="appStore.locale === 'en-US'"
                  >English</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown>
            <span class="user-avatar-box">
              <el-avatar
                :size="28"
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              />
              <span class="username">{{
                authStore.userInfo?.username || "Admin"
              }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item>{{ t("menu.profile") }}</el-dropdown-item> -->
                <el-dropdown-item @click="handleLogout">{{
                  t("menu.logout")
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 3. 主体内容插槽：业务页面挂载于此 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { AppLocale } from "@/locales";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import { useRouter } from "vue-router";
import {
  Sunny,
  Moon,
  Platform,
  User,
  Setting,
  Expand,
  Fold,
} from "@element-plus/icons-vue";

// 侧边栏折叠状态响应式变量
const isCollapse = ref(false);

const { t } = useI18n();
const appStore = useAppStore();
const authStore = useAuthStore();
const router = useRouter();

const handleLangChange = (lang: AppLocale) => {
  appStore.setLocale(lang);
};
const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.layout-aside {
  background-color: #001529;
  transition: width 0.25s cubic-bezier(0.2, 0, 0, 1);
  display: flex;
  flex-direction: column;
}

.logo-box {
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  background-color: #002140;
}

.logo-title {
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
}

.aside-menu {
  border-right: none;
  flex: 1;
}

/* 主体背景与边框使用 Element Plus 官方 CSS 变量，完美兼容暗黑模式 */
.layout-body {
  background-color: var(--el-bg-color-page);
}

.layout-header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-icon {
  font-size: 18px;
  cursor: pointer;
  color: var(--el-text-color-regular);
  transition: color 0.2s;
}
.collapse-icon:hover {
  color: var(--el-color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-avatar-box {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.layout-main {
  padding: 16px;
  overflow-y: auto;
}
</style>
