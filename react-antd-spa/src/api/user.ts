import request from "@/utils/request";
import type {
  UserFormData,
  UserItem,
  UserPageResult,
  UserQueryFilter,
} from "@/types/user";

export const userApi = {
  getList(params?: UserQueryFilter): Promise<UserPageResult> {
    return request.get<UserPageResult>("/users", { params });
  },
  getDetail(id: string): Promise<UserItem> {
    return request.get<UserItem>(`/users/${id}`);
  },
  create(data: UserFormData): Promise<UserItem> {
    return request.post<UserItem>("/users", data);
  },
  update(id: string, data: Partial<UserFormData>): Promise<UserItem> {
    return request.put<UserItem>(`/users/${id}`, data);
  },
  delete(id: string): Promise<void> {
    return request.delete<void>(`/users/${id}`);
  },
  batchDelete(ids: string[]): Promise<void> {
    return request.post<void>("/users/batch-delete", { ids });
  },
};
