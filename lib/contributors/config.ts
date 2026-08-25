import type {
  ContributorRole,
  ContributorStatus,
} from "./types";

export const contributorStatuses: {
  value: ContributorStatus;
  label: string;
}[] = [
  { value: "NEW", label: "New" },
  { value: "REVIEW", label: "In Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
  { value: "INACTIVE", label: "Inactive" },
];

export const contributorRoles: {
  value: ContributorRole;
  label: string;
}[] = [
  { value: "PRESENTER", label: "Presenter / Guest Speaker" },
  { value: "FACILITATOR", label: "Facilitator" },
  { value: "MENTOR", label: "Mentor" },
  { value: "EMPLOYER_PARTNER", label: "Employer / Industry Partner" },
  {
    value: "WORKPLACE_HOST",
    label: "Workplace Tour / Career Experience Host",
  },
  {
    value: "JOB_SHADOW_INTERNSHIP_HOST",
    label: "Job Shadow / Internship Host",
  },
  {
    value: "SPONSOR_SUPPORTER",
    label: "Sponsor / Supporter",
  },
  {
    value: "RESOURCE_COMMUNITY_PARTNER",
    label: "Resource / Community Partner",
  },
  { value: "OTHER", label: "Other" },
  {
    value: "INFORMATION_REQUEST",
    label: "Information Request",
  },
];
