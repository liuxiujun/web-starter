export type UserRole = "admin" | "editor" | "viewer";
export type UserStatus = "active" | "inactive" | "pending";

export interface UserItem {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export type UserFormData = Omit<UserItem, "id" | "createdAt">;

export interface UserPageResult {
  items: UserItem[];
  total: number;
}

export interface UserQueryFilter {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: UserRole | "";
  status?: UserStatus | "";
}
