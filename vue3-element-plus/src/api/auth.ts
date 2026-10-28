import request from "@/utils/request";
import type { LoginCredentials, LoginResult } from "@/types/auth";
import type { UserItem } from "@/types/user";

export const loginApi = (data: LoginCredentials) => {
  return request.post<any, LoginResult>("/auth/login", data);
};
export const getMeApi = () => {
  return request.get<any, UserItem>("/auth/me");
};
