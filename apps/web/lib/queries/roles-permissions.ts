export const roleKeys = {
  all: ["roles"] as const,

  lists: () => [...roleKeys.all, "list"] as const,

  detail: (id: string) => [...roleKeys.all, "detail", id] as const,

  permissions: (id: string) => [...roleKeys.all, "permissions", id] as const,
};

export const permissionKeys = {
  all: ["permissions"] as const,

  lists: () => [...permissionKeys.all, "list"] as const,
};
