# Vue 3.5 + Element Plus 

Vue 3.5 + TypeScript + Vite 8 + Element Plus + Pinia + Vue Router + Vue I18n + MSW + Axios**

---

## 🎯 解决的核心工程问题

1. **摆脱伪 RESTful 耦合**：废弃脱离 HTTP 规范的自定义 `{ code: 200, data: T }` 壳结构，严格遵循 RFC 7231 标准，HTTP 2xx 直出资源，4xx/5xx 统一拦截。
2. **拒绝前端假分页**：摒弃把成百上千条数据一次性拉到浏览器再 `slice` 的假切片；全链路落地服务端真分页（`page`, `pageSize`, `total`）并附带末页删除自愈机制。
3. **消灭散弹式修改（Shotgun Surgery）**：解耦内存状态与磁盘 I/O。利用 Vue 3 的 `watch` 副作用集中管理 `localStorage` 同步，业务 Action 零存储样板代码。
4. **SWR 双保险状态自愈**：本地缓存 0ms 瞬间回显用户名（杜绝刷新空白与跳动）+ 路由导航守卫后台异步向后端校验求证（Token 失效自动安全登出）。
5. **端到端全链路国际化**：前端视图（Vue I18n）+ UI 官方语言包（Element Plus）+ 请求标头（Axios `Accept-Language`）+ 仿真后端多语言报错（MSW）全链路打通。
6. **Design Tokens 暗黑模式 + 防白闪（Anti-FOUC）**：业务样式全面拥抱 CSS 语义化变量；在 `<head>` 中注入原生微脚本，彻底消灭深色模式下按 F5 刷新瞬间的刺眼白闪。

---

## 📂 项目目录结构

```text
vue3-element-plus/
├── public/
│   ├── favicon.svg                # 站点图标
│   └── mockServiceWorker.js       # MSW 浏览器 Service Worker 拦截入口
├── src/
│   ├── api/                       # 声明式网络请求层 (与底层协议解耦)
│   │   ├── auth.ts                # 认证鉴权接口 (login, getMe)
│   │   └── user.ts                # 用户管理 CRUD 接口
│   ├── layout/                    # 后台通用导航布局框架
│   │   └── index.vue              # 侧边栏折叠、面包屑、快捷主题与语言切换
│   ├── locales/                   # 国际化配置中心
│   │   ├── index.ts               # vue-i18n 实例与智能环境探测
│   │   └── lang/                  # 中英文多语言字典 (zh-CN.ts, en-US.ts)
│   ├── mocks/                     # MSW 浏览器后端仿真体系
│   │   ├── browser.ts             # Service Worker 客户端启动器
│   │   ├── db.ts                  # 内存数据表与真实分页逻辑
│   │   └── handlers.ts            # RESTful HTTP 拦截路由与 Accept-Language 仿真
│   ├── router/                    # 路由管理中心
│   │   ├── index.ts               # 嵌套路由表与重定向
│   │   └── guard.ts               # 前置导航守卫与 SWR 用户状态自愈
│   ├── stores/                    # Pinia 全局状态中心
│   │   ├── app.ts                 # 全局配置 (系统名、主题、语言三位一体)
│   │   ├── auth.ts                # 认证凭据与用户信息持久化
│   │   └── user.ts                # 用户 CRUD 列表与服务端真分页
│   ├── types/                     # TypeScript 契约模型 (auth.ts, user.ts)
│   ├── utils/                     # 核心工具库
│   │   └── request.ts             # Axios 单例、标头注入与统一解包拦截
│   ├── views/                     # 业务页面视图
│   │   ├── login/index.vue        # 独立登录页 (多语言响应式规则、回跳记忆)
│   │   ├── settings/index.vue     # 全局系统设置 (聚合更新、消除数据泥团)
│   │   └── user/                  # 用户管理主视图与 CRUD 弹窗组件
│   ├── App.vue                    # 根组件 (集中消费 appStore.epLocale 语言包)
│   └── main.ts                    # 物理应用入口 (样式注入、Pinia、MSW启动)
├── index.html                     # 第一入口 (内置原生 Anti-FOUC 防白闪脚本)
├── package.json                   # 依赖与脚本配置
└── tsconfig.app.json              # 浏览器端 TypeScript 严格规则配置
```

---

## 🚀 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器（MSW 自动就绪）
pnpm dev
```

> 本地开发模式下，MSW 会在后台全自动拦截 `/api/v1/*` 请求并进行真实网络仿真，控制台会输出 `[MSW] Mocking enabled.`。

* 测试账号**：`admin`
* 测试密码**：`123456`
