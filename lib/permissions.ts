import { permissions } from "@/content/permissions";


export function hasPermission(
  role: keyof typeof permissions,
  permission: string
) {

  return permissions[role]?.includes(permission);

}
