export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PARTNER: "PARTNER",
  EMPLOYER: "EMPLOYER",
  STUDENT: "STUDENT",
} as const;


export const permissions = {

  SUPER_ADMIN: [
    "manage_platform",
    "manage_users",
    "manage_organizations",
    "view_audit_logs",
  ],

  ADMIN: [
    "manage_users",
    "manage_organizations",
    "view_reports",
  ],

  PARTNER: [
    "manage_programs",
    "view_students",
    "view_outcomes",
  ],

  EMPLOYER: [
    "create_opportunities",
    "manage_internships",
    "view_matches",
  ],

  STUDENT: [
    "manage_profile",
    "build_portfolio",
    "view_opportunities",
  ],

};
