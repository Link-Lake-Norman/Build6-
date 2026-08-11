"use client";

import { useEffect, useState } from "react";

type PermissionKey =
  | "studentMessageFacilitator"
  | "studentMessageAdmin"
  | "studentPeerMessaging"
  | "studentViewCalendar"
  | "studentUseAiCoach"
  | "studentUploadPortfolio"
  | "facilitatorMessageStudents"
  | "facilitatorBlastCohort"
  | "facilitatorManageAttendance"
  | "facilitatorAssignProfessionals"
  | "facilitatorLessonBuilder"
  | "facilitatorAddActivities"
  | "facilitatorUploadLessonResources"
  | "facilitatorPublishLessonChanges"
  | "facilitatorEditCoreCurriculum"
  | "professionalEditProfile"
  | "professionalUploadResources"
  | "professionalMessageFacilitator"
  | "professionalMessageAdmin"
  | "professionalViewStudents"
  | "professionalMessageStudents"
  | "parentViewProgress"
  | "parentMessageFacilitator"
  | "aiCoach"
  | "aiResume"
  | "aiInterview"
  | "calendarProfessionals"
  | "calendarFieldTrips"
  | "calendarSchoolEvents"
  | "resourceUploads"
  | "resourceDownloads"
  | "messagingEnabled"
  | "externalAccess";

type Permissions = Record<PermissionKey, boolean>;

const STORAGE_KEY = "future-ready:ambassador-permissions";

const defaults: Permissions = {
  studentMessageFacilitator: true,
  studentMessageAdmin: false,
  studentPeerMessaging: false,
  studentViewCalendar: true,
  studentUseAiCoach: true,
  studentUploadPortfolio: true,

  facilitatorMessageStudents: true,
  facilitatorBlastCohort: true,
  facilitatorManageAttendance: true,
  facilitatorAssignProfessionals: true,
  facilitatorLessonBuilder: false,
  facilitatorAddActivities: true,
  facilitatorUploadLessonResources: true,
  facilitatorPublishLessonChanges: false,
  facilitatorEditCoreCurriculum: false,

  professionalEditProfile: true,
  professionalUploadResources: true,
  professionalMessageFacilitator: true,
  professionalMessageAdmin: true,
  professionalViewStudents: false,
  professionalMessageStudents: false,

  parentViewProgress: false,
  parentMessageFacilitator: false,

  aiCoach: true,
  aiResume: true,
  aiInterview: true,

  calendarProfessionals: true,
  calendarFieldTrips: true,
  calendarSchoolEvents: true,

  resourceUploads: true,
  resourceDownloads: true,

  messagingEnabled: true,
  externalAccess: true,
};

const sections: Array<{
  title: string;
  description: string;
  items: Array<{
    key: PermissionKey;
    label: string;
    detail: string;
  }>;
}> = [
  {
    title: "Student Access",
    description: "Control what students can see and do.",
    items: [
      {
        key: "studentMessageFacilitator",
        label: "Message facilitator",
        detail: "Students can send private messages to their assigned facilitator.",
      },
      {
        key: "studentMessageAdmin",
        label: "Message admin",
        detail: "Students can contact the program administrator.",
      },
      {
        key: "studentPeerMessaging",
        label: "Peer messaging",
        detail: "Students can message other students in their cohort.",
      },
      {
        key: "studentViewCalendar",
        label: "View calendar",
        detail: "Students can view approved sessions and events.",
      },
      {
        key: "studentUseAiCoach",
        label: "Use AI Coach",
        detail: "Students can access AI coaching tools.",
      },
      {
        key: "studentUploadPortfolio",
        label: "Add portfolio evidence",
        detail: "Students can add and edit their own portfolio items.",
      },
    ],
  },
  {
    title: "Facilitator Access",
    description: "Control facilitator communication and cohort tools.",
    items: [
      {
        key: "facilitatorMessageStudents",
        label: "Message individual students",
        detail: "Facilitators can send private messages to assigned students.",
      },
      {
        key: "facilitatorBlastCohort",
        label: "Send cohort announcements",
        detail: "Facilitators can send one message to the full cohort.",
      },
      {
        key: "facilitatorManageAttendance",
        label: "Manage attendance",
        detail: "Facilitators can record and edit attendance.",
      },
      {
        key: "facilitatorAssignProfessionals",
        label: "Assign professionals",
        detail: "Facilitators can connect approved professionals to sessions.",
      },
      {
        key: "facilitatorLessonBuilder",
        label: "Use Lesson Builder",
        detail: "Facilitators can create an Ambassador/cohort version without changing the Future Ready™ master lesson.",
      },
      {
        key: "facilitatorAddActivities",
        label: "Add activities and delivery notes",
        detail: "Facilitators can add role plays, improv, case scenarios, timing, and local delivery notes.",
      },
      {
        key: "facilitatorUploadLessonResources",
        label: "Add lesson resources",
        detail: "Facilitators can add workbooks, slides, handouts, videos, activities, and shared links.",
      },
      {
        key: "facilitatorPublishLessonChanges",
        label: "Publish changes without approval",
        detail: "When off, facilitator changes are submitted to the admin for approval before students see them.",
      },
      {
        key: "facilitatorEditCoreCurriculum",
        label: "Edit protected core curriculum",
        detail: "Keep off to protect Future Ready™ objectives, competencies, assessments, badges, and master language.",
      },
    ],
  },
  {
    title: "Professional Access",
    description: "Professionals never receive student access unless explicitly enabled.",
    items: [
      {
        key: "professionalEditProfile",
        label: "Edit own profile",
        detail: "Invited professionals can complete and update their own profile.",
      },
      {
        key: "professionalUploadResources",
        label: "Upload session resources",
        detail: "Professionals can add slides, handouts, and activity materials.",
      },
      {
        key: "professionalMessageFacilitator",
        label: "Message facilitator",
        detail: "Professionals can contact their assigned facilitator.",
      },
      {
        key: "professionalMessageAdmin",
        label: "Message admin",
        detail: "Professionals can contact the program administrator.",
      },
      {
        key: "professionalViewStudents",
        label: "View students",
        detail: "Keep off to protect all student names, profiles, and records.",
      },
      {
        key: "professionalMessageStudents",
        label: "Message students",
        detail: "Keep off unless the admin approves a specific mentoring connection.",
      },
    ],
  },
  {
    title: "Parent / Guardian Access",
    description: "Turn parent access on only when the school is ready.",
    items: [
      {
        key: "parentViewProgress",
        label: "View student progress",
        detail: "Parents can view approved progress information for their student.",
      },
      {
        key: "parentMessageFacilitator",
        label: "Message facilitator",
        detail: "Parents can contact the assigned facilitator.",
      },
    ],
  },
  {
    title: "AI Tools",
    description: "Turn individual AI features on or off.",
    items: [
      {
        key: "aiCoach",
        label: "AI Coach",
        detail: "Enable general student coaching support.",
      },
      {
        key: "aiResume",
        label: "AI Résumé Support",
        detail: "Enable résumé writing and revision tools.",
      },
      {
        key: "aiInterview",
        label: "AI Interview Practice",
        detail: "Enable interview preparation and practice.",
      },
    ],
  },
  {
    title: "Calendar & Resources",
    description: "Choose which operational tools are active.",
    items: [
      {
        key: "calendarProfessionals",
        label: "Professional sessions",
        detail: "Show approved professional sessions on the calendar.",
      },
      {
        key: "calendarFieldTrips",
        label: "Field experiences",
        detail: "Allow field trip and workplace visit planning.",
      },
      {
        key: "calendarSchoolEvents",
        label: "School events",
        detail: "Show testing, holidays, and school events.",
      },
      {
        key: "resourceUploads",
        label: "Resource uploads",
        detail: "Allow approved users to upload resources.",
      },
      {
        key: "resourceDownloads",
        label: "Resource downloads",
        detail: "Allow approved users to download resources.",
      },
    ],
  },
];

function loadPermissions(): Permissions {
  if (typeof window === "undefined") return defaults;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored
      ? { ...defaults, ...(JSON.parse(stored) as Partial<Permissions>) }
      : defaults;
  } catch {
    return defaults;
  }
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permissions>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPermissions(loadPermissions());
  }, []);

  function toggle(key: PermissionKey) {
    setPermissions((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setSaved(false);
  }

  function savePermissions() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
    setSaved(true);
  }

  function applyRecommendedDefaults() {
    setPermissions(defaults);
    setSaved(false);
  }

  function emergencyLock() {
    setPermissions((current) => ({
      ...current,
      messagingEnabled: false,
      externalAccess: false,
      resourceUploads: false,
      studentPeerMessaging: false,
      professionalMessageStudents: false,
      professionalViewStudents: false,
      aiCoach: false,
      aiResume: false,
      aiInterview: false,
    }));
    setSaved(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[30px] bg-[#0D1B3D] px-7 py-8 text-white shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F2B705]">
            Ambassador Christian School
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black">Access & Permissions</h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
                Turn access on or off without changing code. Student and
                professional information stays private by default.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={applyRecommendedDefaults}
                className="rounded-xl border border-white/30 px-5 py-3 font-black"
              >
                Recommended Settings
              </button>

              <button
                type="button"
                onClick={savePermissions}
                className="rounded-xl bg-[#F2B705] px-5 py-3 font-black text-[#0D1B3D]"
              >
                Save Permissions
              </button>
            </div>
          </div>

          {saved ? (
            <p className="mt-4 font-black text-emerald-300">
              Permissions saved.
            </p>
          ) : null}
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <StatusCard
            title="Messaging"
            enabled={permissions.messagingEnabled}
            onToggle={() => toggle("messagingEnabled")}
          />

          <StatusCard
            title="External Access"
            enabled={permissions.externalAccess}
            onToggle={() => toggle("externalAccess")}
          />

          <button
            type="button"
            onClick={emergencyLock}
            className="rounded-3xl border border-red-200 bg-red-50 p-6 text-left shadow-sm"
          >
            <p className="text-sm font-black uppercase tracking-[0.14em] text-red-700">
              Emergency Lock
            </p>
            <p className="mt-2 text-2xl font-black text-red-900">
              Pause interactive access
            </p>
            <p className="mt-3 leading-7 text-red-800">
              Turns off messaging, AI, uploads, external access, and all
              professional-to-student access.
            </p>
          </button>
        </section>

        <div className="mt-8 space-y-7">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-black text-[#0D1B3D]">
                {section.title}
              </h2>
              <p className="mt-2 text-slate-600">{section.description}</p>

              <div className="mt-6 divide-y divide-slate-100">
                {section.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="max-w-3xl">
                      <p className="font-black text-[#0D1B3D]">
                        {item.label}
                      </p>
                      <p className="mt-1 leading-6 text-slate-600">
                        {item.detail}
                      </p>
                    </div>

                    <Toggle
                      enabled={permissions[item.key]}
                      onClick={() => toggle(item.key)}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative h-8 w-16 shrink-0 rounded-full transition ${
        enabled ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
          enabled ? "left-9" : "left-1"
        }`}
      />
    </button>
  );
}

function StatusCard({
  title,
  enabled,
  onToggle,
}: {
  title: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm"
    >
      <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-3xl font-black text-[#0D1B3D]">
        {enabled ? "On" : "Off"}
      </p>
      <p className="mt-2 text-slate-600">Click to change.</p>
    </button>
  );
}
