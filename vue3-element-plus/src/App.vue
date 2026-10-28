<script setup lang="ts">
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
</script>

<template>
  <!-- 直接消费 appStore 集中派生的 Element Plus 语言包，实现单源驱动 -->
  <el-config-provider :locale="appStore.epLocale">
    <router-view />
  </el-config-provider>
</template>

<style>
/* 清理默认 margin */
body {
  margin: 0;
  padding: 0;
}
</style>
