export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export const RolePermissions = {
  [Role.ADMIN]: {
    projects: {
      viewAll: true,
      create: true,
      editAny: true,
      deleteAny: true,
    },
    tasks: {
      viewAll: true,
      create: true,
      editAny: true,
      deleteAny: true,
    },
    users: {
      viewAll: true,
      create: true,
      edit: true,
      delete: true,
    },
  },
  [Role.USER]: {
    projects: {
      viewAll: false,
      create: true,
      editAny: false,
      deleteAny: false,
    },
    tasks: {
      viewAll: false,
      create: true,
      editAny: false,
      deleteAny: false,
    },
    users: {
      viewAll: false,
      create: false,
      edit: false,
      delete: false,
    },
  },
} as const;

export type Permission = keyof typeof RolePermissions[Role.ADMIN];
