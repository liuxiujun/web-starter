<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import type { AppLocale } from "@/locales";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import type { LoginCredentials } from "@/types/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appStore = useAppStore();
const { t } = useI18n();

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive<LoginCredentials>({
  username: "admin",
  password: "123456",
});

// 关键技巧：将 rules 包裹在 computed 中，语言切换时表单错误提示会自动实时响应变动！
const rules = computed<FormRules<LoginCredentials>>(() => ({
  username: [
    {
      required: true,
      message: t("login.rules.usernameRequired"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: t("login.rules.passwordRequired"),
      trigger: "blur",
    },
  ],
}));

// 登录页切换语言：直接委托 appStore，自动完成持久化与组件库多语言桥接
const handleLangChange = (lang: AppLocale) => {
  appStore.setLocale(lang);
};

const handleLogin = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    await authStore.login(form);
    ElMessage.success(t("login.loginSuccess"));
    const redirectTarget = (route.query.redirect as string) || "/";
    router.push(redirectTarget);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-wrapper">
    <!-- 右上角多语言切换器 -->
    <div class="lang-switch-box">
      <el-dropdown @command="handleLangChange">
        <el-button size="small" round>
          🌐 {{ appStore.locale === "zh-CN" ? "简体中文" : "English" }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              command="zh-CN"
              :disabled="appStore.locale === 'zh-CN'"
            >
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              command="en-US"
              :disabled="appStore.locale === 'en-US'"
            >
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 登录卡片 -->
    <el-card class="login-card" shadow="always">
      <div class="login-header">
        <h2 class="title">{{ t("login.title") }}</h2>
        <p class="subtitle">{{ t("login.subtitle") }}</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            :prefix-icon="User"
            :placeholder="t('login.usernamePlaceholder')"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :prefix-icon="Lock"
            :placeholder="t('login.passwordPlaceholder')"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="submit-btn"
          :loading="loading"
          @click="handleLogin"
        >
          {{ loading ? t("login.loading") : t("login.submit") }}
        </el-button>
      </el-form>

      <div class="login-tips">
        <el-tag type="info" size="small">
          {{ t("login.demoHint") }}
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.login-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1f1c2c 0%, #928dab 100%);
}
.lang-switch-box {
  position: absolute;
  top: 24px;
  right: 24px;
}
.login-card {
  width: 400px;
  padding: 20px 24px;
  border-radius: 12px;
}
.login-header {
  text-align: center;
  margin-bottom: 24px;
}
.title {
  margin: 0;
  font-size: 24px;
  color: var(--el-text-color-primary);
}
.subtitle {
  margin-top: 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.submit-btn {
  width: 100%;
  margin-top: 12px;
}
.login-tips {
  margin-top: 16px;
  text-align: center;
}
</style>
