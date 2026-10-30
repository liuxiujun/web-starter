import type {
  UserItem,
  UserFormData,
  UserQueryFilter,
  UserPageResult,
} from "@/types/user";

export interface MockUserRecord extends UserItem {
  passwordHash: string;
}

let usersTable: MockUserRecord[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    createdAt: "2026-01-15",
    passwordHash: "123456",
  },
  {
    id: "2",
    username: "Elena Vance",
    email: "elena@example.com",
    role: "editor",
    status: "active",
    createdAt: "2026-02-10",
    passwordHash: "123456",
  },
  {
    id: "3",
    username: "Gordon Freeman",
    email: "freeman@example.com",
    role: "viewer",
    status: "inactive",
    createdAt: "2026-02-18",
    passwordHash: "123456",
  },
  {
    id: "4",
    username: "Sarah Connor",
    email: "sarah@cyberdyne.org",
    role: "admin",
    status: "active",
    createdAt: "2026-03-01",
    passwordHash: "123456",
  },
  {
    id: "5",
    username: "Neo Anderson",
    email: "neo@matrix.io",
    role: "editor",
    status: "pending",
    createdAt: "2026-03-12",
    passwordHash: "123456",
  },
  {
    id: "6",
    username: "Trinity Moss",
    email: "trinity@matrix.io",
    role: "editor",
    status: "active",
    createdAt: "2026-03-15",
    passwordHash: "123456",
  },
  {
    id: "7",
    username: "Morpheus King",
    email: "morpheus@matrix.io",
    role: "admin",
    status: "active",
    createdAt: "2026-03-20",
    passwordHash: "123456",
  },
  {
    id: "8",
    username: "Agent Smith",
    email: "smith@matrix.io",
    role: "viewer",
    status: "inactive",
    createdAt: "2026-04-01",
    passwordHash: "123456",
  },
];

export const mockDb = {
  authenticate(username: string, password: string): UserItem | null {
    const user = usersTable.find(
      (u) => u.username === username && u.passwordHash === password,
    );
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  queryUsers(filter?: UserQueryFilter): UserPageResult {
    let filtered = usersTable;
    if (filter) {
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.username.toLowerCase().includes(kw) ||
            item.email.toLowerCase().includes(kw),
        );
      }
      if (filter.role) {
        filtered = filtered.filter((item) => item.role === filter.role);
      }
      if (filter.status) {
        filtered = filtered.filter((item) => item.status === filter.status);
      }
    }

    const total = filtered.length;
    const page = Number(filter?.page) || 1;
    const pageSize = Number(filter?.pageSize) || 5;
    const start = (page - 1) * pageSize;
    const items = filtered
      .slice(start, start + pageSize)
      .map(({ passwordHash, ...safeUser }) => safeUser);

    return { items, total };
  },

  insertUser(data: UserFormData): UserItem {
    const newUser: MockUserRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString().slice(0, 10),
      passwordHash: "123456",
    };
    usersTable.unshift(newUser);
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  },

  updateUser(id: string, data: UserFormData): UserItem | null {
    const idx = usersTable.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    usersTable[idx] = { ...usersTable[idx], ...data };
    const { passwordHash, ...safeUser } = usersTable[idx];
    return safeUser;
  },

  deleteUser(id: string): boolean {
    const initialLen = usersTable.length;
    usersTable = usersTable.filter((u) => u.id !== id);
    return usersTable.length < initialLen;
  },
};
