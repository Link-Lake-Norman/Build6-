import type { UserRole } from "./session";


export function isAdmin(role: UserRole) {

  return (
    role === "ADMIN" ||
    role === "SUPER_ADMIN"
  );

}


export function isEmployer(role: UserRole) {

  return role === "EMPLOYER";

}


export function isStudent(role: UserRole) {

  return role === "STUDENT";

}
