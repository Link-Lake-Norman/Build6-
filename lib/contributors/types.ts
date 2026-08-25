export type ContributorSource =
  | "INQUIRY"
  | "INVITED";

export type ContributorStatus =
  | "NEW"
  | "REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "DECLINED"
  | "INACTIVE";

export type ContributorRole =
  | "PRESENTER"
  | "FACILITATOR"
  | "MENTOR"
  | "EMPLOYER_PARTNER"
  | "WORKPLACE_HOST"
  | "JOB_SHADOW_INTERNSHIP_HOST"
  | "SPONSOR_SUPPORTER"
  | "RESOURCE_COMMUNITY_PARTNER"
  | "OTHER"
  | "INFORMATION_REQUEST";

export type EngagementFormat =
  | "IN_PERSON"
  | "VIRTUAL"
  | "EITHER"
  | "UNDECIDED";

export interface Contributor {
  id: string;

  source: ContributorSource;
  status: ContributorStatus;
  roles: ContributorRole[];

  firstName: string;
  lastName: string;

  organization: string;
  title?: string;

  email: string;
  phone?: string;

  linkedin?: string;
  website?: string;

  bio?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ContributorEngagement {
  id: string;
  contributorId: string;

  schoolId?: string;
  cohortId?: string;

  title?: string;
  description?: string;
  studentOutcome?: string;

  industryPathway?: string;

  format?: EngagementFormat;

  proposedDate?: string;
  proposedTime?: string;

  confirmedDate?: string;
  confirmedTime?: string;

  location?: string;
  availability?: string;

  notes?: string;

  status: ContributorStatus;

  createdAt: string;
  updatedAt: string;
}

export interface ContributorSubmission {
  source: ContributorSource;

  role: ContributorRole;

  firstName: string;
  lastName: string;

  organization: string;
  title?: string;

  email: string;
  phone?: string;

  linkedin?: string;
  website?: string;

  engagementTitle?: string;
  description?: string;
  studentOutcome?: string;

  industryPathway?: string;
  format?: EngagementFormat;

  proposedDate?: string;
  proposedTime?: string;

  location?: string;
  availability?: string;

  bio?: string;
  notes?: string;

  consent: boolean;
}
