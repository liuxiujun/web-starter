import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserFormData, UserItem, UserQueryFilter } from "@/types/user";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "@/api/user";

export const useUserStore = defineStore("user", () => {
  const list = ref<UserItem[]>([]);
  const total = ref(0);
  const loading = ref(false);

  const totalCount = computed(() => list.value.length);
  const statusCounts = computed(() => ({
    active: list.value.filter((u) => u.status === "active").length,
    pending: list.value.filter((u) => u.status === "pending").length,
    inactive: list.value.filter((u) => u.status === "inactive").length,
  }));

  const fetchUsers = async (filter?: UserQueryFilter) => {
    loading.value = true;
    try {
      const res = await getUsersApi(filter);
      list.value = res.items;
      total.value = res.total;
    } finally {
      loading.value = false;
    }
  };

  const addUser = async (data: UserFormData) => {
    loading.value = true;
    try {
      const newUser = await createUserApi(data);
      list.value.unshift(newUser);
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: string, data: UserFormData) => {
    loading.value = true;
    try {
      const updated = await updateUserApi(id, data);
      const idx = list.value.findIndex((u) => u.id === id);
      if (idx !== -1) {
        list.value[idx] = updated;
      }
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: string) => {
    await deleteUserApi(id);
    list.value = list.value.filter((u) => u.id !== id);
  };

  return {
    list,
    total,
    loading,
    totalCount,
    statusCounts,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
});
