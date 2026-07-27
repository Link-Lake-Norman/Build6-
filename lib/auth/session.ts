export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PARTNER"
  | "EMPLOYER"
  | "STUDENT";


export type SessionUser = {

  id: string;

  name: string;

  role: UserRole;

  organizationId?: string;

};


export function getSessionUser(): SessionUser | null {

  return null;

}
