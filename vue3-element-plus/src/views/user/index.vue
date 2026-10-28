<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import {
  Plus,
  Delete,
  Search,
  Refresh,
  User,
  CircleCheck,
  Clock,
  CircleClose,
} from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import type {
  UserItem,
  UserFormData,
  UserQueryFilter,
  UserRole,
  UserStatus,
} from "@/types/user";
import UserDialog from "./components/UserDialog.vue";

const { t } = useI18n();
const userStore = useUserStore();

// 1. 服务端查询统一入参模型（融合搜索条件与分页参数）
const queryParams = reactive<Required<UserQueryFilter>>({
  page: 1,
  pageSize: 5,
  keyword: "",
  role: "",
  status: "",
});

// 2. 表格多选行暂存
const selectedUsers = ref<UserItem[]>([]);

// 3. 弹窗受控状态（单一真实数据源）
const editingUser = ref<Partial<UserItem> | null>(null);
const dialogVisible = computed({
  get: () => editingUser.value !== null,
  set: (val: boolean) => {
    if (!val) editingUser.value = null;
  },
});

// 4. 标签语义化色彩映射
const roleTagMap = computed<
  Record<UserRole, { label: string; type: "danger" | "warning" | "info" }>
>(() => ({
  admin: { label: t("role.admin"), type: "danger" },
  editor: { label: t("role.editor"), type: "warning" },
  viewer: { label: t("role.viewer"), type: "info" },
}));

const statusTagMap = computed<
  Record<UserStatus, { label: string; type: "success" | "info" | "warning" }>
>(() => ({
  active: { label: t("status.active"), type: "success" },
  inactive: { label: t("status.inactive"), type: "info" },
  pending: { label: t("status.pending"), type: "warning" },
}));

// 5. 核心数据驱动器：向服务端请求真实分页数据
const loadData = async () => {
  await userStore.fetchUsers(queryParams);
};

// 事件：点击搜索（分页需重置回第 1 页）
const handleSearch = () => {
  queryParams.page = 1;
  loadData();
};

// 事件：点击重置
const handleReset = () => {
  queryParams.keyword = "";
  queryParams.role = "";
  queryParams.status = "";
  queryParams.page = 1;
  loadData();
};

// 事件：页码变化
const handleCurrentChange = (newPage: number) => {
  queryParams.page = newPage;
  loadData();
};

// 事件：每页条数变化
const handleSizeChange = (newSize: number) => {
  queryParams.pageSize = newSize;
  queryParams.page = 1;
  loadData();
};

// 事件：表格勾选
const handleSelectionChange = (rows: UserItem[]) => {
  selectedUsers.value = rows;
};

// 事件：打开新建
const handleOpenCreate = () => {
  editingUser.value = {};
};

// 事件：打开编辑（浅拷贝避免引用污染）
const handleOpenEdit = (row: UserItem) => {
  editingUser.value = { ...row };
};

// 事件：弹窗提交（更新后重新刷新服务端列表）
const handleDialogSubmit = async (formData: UserFormData) => {
  if (editingUser.value?.id) {
    await userStore.updateUser(editingUser.value.id, formData);
    ElMessage.success(t("user.updateSuccess"));
  } else {
    await userStore.addUser(formData);
    ElMessage.success(t("user.createSuccess"));
  }
  loadData();
};

// 事件：单条删除（包含末页空数据自动回退防崩逻辑）
const handleDelete = async (id: string) => {
  await userStore.deleteUser(id);
  ElMessage.success(t("user.deleteSuccess"));
  // 防御：若当前页只剩 1 条且删除了，自动向前退一页
  if (userStore.list.length === 1 && queryParams.page > 1) {
    queryParams.page--;
  }
  loadData();
};

// 事件：批量删除
const handleBatchDelete = async () => {
  if (!selectedUsers.value.length) return;

  try {
    await ElMessageBox.confirm(
      t("user.batchDeleteConfirm", { count: selectedUsers.value.length }),
      t("common.delete"),
      {
        confirmButtonText: t("common.delete"),
        cancelButtonText: t("common.cancel"),
        type: "warning",
      },
    );

    for (const user of selectedUsers.value) {
      await userStore.deleteUser(user.id);
    }

    selectedUsers.value = [];
    ElMessage.success(t("user.batchDeleteSuccess"));

    if (
      userStore.list.length <= selectedUsers.value.length &&
      queryParams.page > 1
    ) {
      queryParams.page--;
    }
    loadData();
  } catch {
    // 取消
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="user-view">
    <!-- 指标概览统计卡片 -->
    <el-row :gutter="16" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon class="stat-icon total"><User /></el-icon>
            <div>
              <div class="stat-label">{{ t("user.total") }}</div>
              <div class="stat-val">{{ userStore.total }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon class="stat-icon active"><CircleCheck /></el-icon>
            <div>
              <div class="stat-label">{{ t("user.active") }}</div>
              <div class="stat-val">
                {{ userStore.list.filter((u) => u.status === "active").length }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon class="stat-icon pending"><Clock /></el-icon>
            <div>
              <div class="stat-label">{{ t("user.pending") }}</div>
              <div class="stat-val">
                {{
                  userStore.list.filter((u) => u.status === "pending").length
                }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <el-icon class="stat-icon inactive"><CircleClose /></el-icon>
            <div>
              <div class="stat-label">{{ t("user.inactive") }}</div>
              <div class="stat-val">
                {{
                  userStore.list.filter((u) => u.status === "inactive").length
                }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索筛选与操作区 -->
    <el-card shadow="never" class="table-container">
      <div class="action-bar">
        <el-form :inline="true" :model="queryParams" class="filter-form">
          <el-form-item :label="t('common.keyword')">
            <el-input
              v-model="queryParams.keyword"
              :placeholder="t('user.placeholderKeyword')"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
          </el-form-item>

          <el-form-item :label="t('user.role')">
            <el-select
              v-model="queryParams.role"
              :placeholder="t('common.all')"
              clearable
              style="width: 120px"
              @change="handleSearch"
            >
              <el-option :label="t('role.admin')" value="admin" />
              <el-option :label="t('role.editor')" value="editor" />
              <el-option :label="t('role.viewer')" value="viewer" />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('user.status')">
            <el-select
              v-model="queryParams.status"
              :placeholder="t('common.all')"
              clearable
              style="width: 120px"
              @change="handleSearch"
            >
              <el-option :label="t('status.active')" value="active" />
              <el-option :label="t('status.inactive')" value="inactive" />
              <el-option :label="t('status.pending')" value="pending" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">{{
              t("common.search")
            }}</el-button>
            <el-button :icon="Refresh" @click="handleReset">{{
              t("common.reset")
            }}</el-button>
          </el-form-item>
        </el-form>

        <div class="buttons">
          <el-button type="primary" :icon="Plus" @click="handleOpenCreate">
            {{ t("user.createUser") }}
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="!selectedUsers.length"
            @click="handleBatchDelete"
          >
            {{ t("common.batchDelete") }} ({{ selectedUsers.length }})
          </el-button>
        </div>
      </div>

      <!-- 服务端真数据表格 -->
      <el-table
        v-loading="userStore.loading"
        :data="userStore.list"
        row-key="id"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          prop="username"
          :label="t('user.username')"
          min-width="140"
        />
        <el-table-column
          prop="email"
          :label="t('user.email')"
          min-width="180"
        />

        <el-table-column
          prop="role"
          :label="t('user.role')"
          width="110"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="roleTagMap[row.role as UserRole].type">
              {{ roleTagMap[row.role as UserRole].label }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          :label="t('user.status')"
          width="110"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="statusTagMap[row.status as UserStatus].type">
              {{ statusTagMap[row.status as UserStatus].label }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="createdAt"
          :label="t('user.createdAt')"
          width="130"
          align="center"
        />

        <el-table-column
          :label="t('common.action')"
          width="160"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleOpenEdit(row as UserItem)"
            >
              {{ t("common.edit") }}
            </el-button>
            <el-popconfirm
              :title="t('user.deleteConfirm')"
              :confirm-button-text="t('common.delete')"
              :cancel-button-text="t('common.cancel')"
              confirm-button-type="danger"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button link type="danger" size="small">{{
                  t("common.delete")
                }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 服务端真实驱动分页栏 -->
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="queryParams.page"
          :page-size="queryParams.pageSize"
          :total="userStore.total"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 弹窗子组件 -->
    <UserDialog
      v-model:visible="dialogVisible"
      :initial-data="editingUser"
      @submit="handleDialogSubmit"
    />
  </div>
</template>

<style scoped>
.user-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.stat-cards .stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon {
  font-size: 32px;
  padding: 12px;
  border-radius: 8px;
}
.stat-icon.total {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.stat-icon.active {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}
.stat-icon.pending {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}
.stat-icon.inactive {
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
}
.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.stat-val {
  font-size: 22px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-top: 4px;
}
.table-container {
  border-radius: 8px;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.filter-form {
  margin-bottom: 0;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
