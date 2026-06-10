export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const RolePermissions = {
  [Role.ADMIN]: {
    projects: { viewAll: true, create: true, editAny: true, deleteAny: true },
    tasks: { viewAll: true, create: true, editAny: true, deleteAny: true },
    users: { viewAll: true, create: true, edit: true, delete: true },
  },
  [Role.USER]: {
    projects: { viewAll: false, create: true, editAny: false, deleteAny: false },
    tasks: { viewAll: false, create: true, editAny: false, deleteAny: false },
    users: { viewAll: false, create: false, edit: false, delete: false },
  },
} as const;

export function canUserPerform(
  role: Role,
  resource: 'projects' | 'tasks' | 'users',
  action: string,
): boolean {
  const permissions = RolePermissions[role]?.[resource];
  return permissions ? (permissions as Record<string, boolean>)[action] ?? false : false;
}
