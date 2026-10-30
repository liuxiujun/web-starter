import request from "@/utils/request";
import type { LoginCredentials, LoginResult } from "@/types/auth";
import type { UserItem } from "@/types/user";

export const authApi = {
  login(data: LoginCredentials): Promise<LoginResult> {
    return request.post<LoginResult>("/auth/login", data);
  },
  getMe(): Promise<UserItem> {
    return request.get<UserItem>("/auth/me");
  },
  logout(): Promise<void> {
    return request.post<void>("/auth/logout");
  },
};
