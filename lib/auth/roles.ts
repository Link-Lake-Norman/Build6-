import type {
  SessionUser,
  UserRole,
} from "./session";

export function isAdminRole(
  role: UserRole
) {
  return (
    role === "SUPER_ADMIN" ||
    role === "ORGANIZATION_ADMIN" ||
    role === "SCHOOL_ADMIN"
  );
}

export function isFacilitatorRole(
  role: UserRole
) {
  return (
    isAdminRole(role) ||
    role === "FACILITATOR"
  );
}

export function isEmployerRole(
  role: UserRole
) {
  return role === "EMPLOYER";
}

export function isStudentRole(
  role: UserRole
) {
  return role === "STUDENT";
}

export function canManageStudents(
  user: SessionUser | null
) {
  return Boolean(
    user &&
      (
        isAdminRole(user.role) ||
        user.role === "FACILITATOR"
      )
  );
}

export function canManageCurriculum(
  user: SessionUser | null
) {
  return Boolean(
    user &&
      (
        isAdminRole(user.role) ||
        user.role === "FACILITATOR"
      )
  );
}

export function canManageOrganization(
  user: SessionUser | null
) {
  return Boolean(
    user &&
      (
        user.role === "SUPER_ADMIN" ||
        user.role === "ORGANIZATION_ADMIN"
      )
  );
}

export function canManageSchool(
  user: SessionUser | null
) {
  return Boolean(
    user &&
      (
        user.role === "SUPER_ADMIN" ||
        user.role === "ORGANIZATION_ADMIN" ||
        user.role === "SCHOOL_ADMIN"
      )
  );
}
