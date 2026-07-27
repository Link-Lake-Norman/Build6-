import { hasPermission } from "@/lib/permissions";


export function canAccess(
  role: keyof typeof import("@/content/permissions").permissions,
  permission: string
) {

  return hasPermission(role, permission);

}
