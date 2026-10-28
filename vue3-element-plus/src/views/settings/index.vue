<script setup lang="ts">
import { reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useAppStore, type AppSettings } from "@/stores/app";

const { t } = useI18n();
const appStore = useAppStore();

// 1. 源头强类型契约绑定（消除类型断言 as 与命名偏差 language）
const settings = reactive<AppSettings>({
  systemName: appStore.systemName,
  theme: appStore.theme,
  locale: appStore.locale,
});

// 2. 双向同步：外部状态（如 Header 快捷切换主题/语言）变化时实时回显到表单
watch(
  () => appStore.systemName,
  (val) => {
    settings.systemName = val;
  },
);
watch(
  () => appStore.theme,
  (val) => {
    settings.theme = val;
  },
);
watch(
  () => appStore.locale,
  (val) => {
    settings.locale = val;
  },
);

// 3. 聚合式原子保存（彻底消除数据泥团 Data Clump）
const handleSave = () => {
  appStore.updateSettings(settings);
  ElMessage.success(t("settings.savedMessage"));
};
</script>

<template>
  <div class="settings-view">
    <el-card :header="t('settings.title')" shadow="never">
      <el-form :model="settings" label-width="150px" style="max-width: 500px">
        <el-form-item :label="t('settings.systemName')">
          <el-input v-model="settings.systemName" />
        </el-form-item>

        <el-form-item :label="t('settings.language')">
          <el-select v-model="settings.locale">
            <el-option label="简体中文 (zh-CN)" value="zh-CN" />
            <el-option label="English (en-US)" value="en-US" />
          </el-select>
        </el-form-item>

        <el-form-item :label="t('settings.theme')">
          <el-radio-group v-model="settings.theme">
            <el-radio value="light">{{ t("settings.lightTheme") }}</el-radio>
            <el-radio value="dark">{{ t("settings.darkTheme") }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave">{{
            t("settings.save")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 800px;
}
</style>
