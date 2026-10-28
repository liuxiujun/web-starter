import { http, HttpResponse, delay } from "msw";
import { mockDb } from "./db";
import type { LoginCredentials } from "@/types/auth";
import type { UserFormData, UserRole, UserStatus } from "@/types/user";

// 模拟后端多语言国际化字典
const mockI18nMessages = {
  "zh-CN": {
    authFailed: "用户名或密码错误（测试账号: admin / 123456）",
    sessionExpired: "登录状态已失效，请重新登录",
    unauthorized: "未授权，请先登录",
    userNotFound: "目标用户不存在",
  },
  "en-US": {
    authFailed: "Invalid username or password (test: admin / 123456)",
    sessionExpired: "Session expired, please sign in again",
    unauthorized: "Unauthorized, please sign in first",
    userNotFound: "User not found",
  },
};

const getMsg = (
  request: Request,
  key: keyof (typeof mockI18nMessages)["zh-CN"],
) => {
  const langHeader = request.headers.get("Accept-Language") || "zh-CN";
  const lang = langHeader.startsWith("en") ? "en-US" : "zh-CN";
  return mockI18nMessages[lang][key];
};

export const handlers = [
  // 1. 登录：成功 200，失败 400
  http.post("/api/v1/auth/login", async ({ request }) => {
    await delay(250);
    const body = (await request.json()) as LoginCredentials;
    const user = mockDb.authenticate(body.username, body.password);
    if (!user) {
      return HttpResponse.json(
        { message: getMsg(request, "authFailed") },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      token: `mock-jwt-token-for-${user.id}-${Date.now()}`,
      user,
    });
  }),

  // 2. 个人资料：成功 200，未授权 401
  http.get("/api/v1/auth/me", async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer mock-jwt-token-")) {
      return HttpResponse.json(
        { message: getMsg(request, "sessionExpired") },
        { status: 401 },
      );
    }
    const adminUser = mockDb.queryUsers({ keyword: "admin" }).items[0];
    return HttpResponse.json(adminUser);
  }),

  // 3. 用户列表：服务端真分页返回 { items, total }
  http.get("/api/v1/users", async ({ request }) => {
    await delay(200);
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return HttpResponse.json(
        { message: getMsg(request, "unauthorized") },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 5;
    const keyword = url.searchParams.get("keyword") || "";
    const role = (url.searchParams.get("role") || "") as UserRole | "";
    const status = (url.searchParams.get("status") || "") as UserStatus | "";

    const pageResult = mockDb.queryUsers({
      page,
      pageSize,
      keyword,
      role,
      status,
    });
    return HttpResponse.json(pageResult);
  }),

  // 4. 新增用户：成功 201 Created
  http.post("/api/v1/users", async ({ request }) => {
    await delay(150);
    const body = (await request.json()) as UserFormData;
    const newUser = mockDb.insertUser(body);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // 5. 更新用户：成功 200，不存在 404
  http.put("/api/v1/users/:id", async ({ params, request }) => {
    await delay(150);
    const { id } = params;
    const body = (await request.json()) as UserFormData;
    const updated = mockDb.updateUser(String(id), body);
    if (!updated) {
      return HttpResponse.json(
        { message: getMsg(request, "userNotFound") },
        { status: 404 },
      );
    }
    return HttpResponse.json(updated);
  }),

  // 6. 删除用户：成功 204 No Content
  http.delete("/api/v1/users/:id", async ({ params }) => {
    await delay(150);
    const { id } = params;
    mockDb.deleteUser(String(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
