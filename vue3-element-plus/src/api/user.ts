import request from "@/utils/request";
import type { UserItem, UserFormData, UserQueryFilter, UserPageResult } from "@/types/user";

export const getUsersApi = (params?: UserQueryFilter) => {
  return request.get<any, UserPageResult>("/users", { params });
};

export const createUserApi = (data: UserFormData) => {
  return request.post<any, UserItem>("/users", data);
};

export const updateUserApi = (id: string, data: UserFormData) => {
  return request.put<any, UserItem>(`/users/${id}`, data);
};

export const deleteUserApi = (id: string) => {
  return request.delete<any, void>(`/users/${id}`);
};
