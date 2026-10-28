import type { UserItem } from "./user";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: UserItem;
}
