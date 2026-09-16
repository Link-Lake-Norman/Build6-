import Link from "next/link";

import {
  getStudentAccountability,
  type StudentAccountabilityAssignment,
  type StudentAccountabilityState,
} from "@/lib/ambassador/student-accountability";

type Props = {
  studentId: string;
  cohortId: string;
  variant?: "dashboard" | "full";
};

function assignmentHref(
  studentId: string,
  assignment: StudentAccountabilityAssignment,
) {
  return `/ambassador/student-portal/${studentId}/assignments?week=${assignment.weekNumber}#assignment-card-${assignment.id}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(value));
}

function StatusPill({
  state,
  completeLabel = "COMPLETE",
  missingLabel = "NOT COMPLETE",
}: {
  state: StudentAccountabilityState;
  completeLabel?: string;
  missingLabel?: string;
}) {
  if (state === "NO_WORK") {
    return (
      <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
        NO REQUIRED WORK
      </span>
    );
  }

  if (state === "NOT_DUE") {
    return (
      <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-800">
        NOT DUE YET
      </span>
    );
  }

  if (state === "COMPLETE") {
    return (
      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
        CHECK {completeLabel}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-black text-red-700">
      X {missingLabel}
    </span>
  );
}

export default async function StudentAccountabilityPanel({
  studentId,
  cohortId,
  variant = "dashboard",
}: Props) {
  const accountability =
    await getStudentAccountability(
      studentId,
      cohortId,
    );

  const pending =
    accountability.pendingAssignments;

  const futureCount =
    accountability.assignments.filter(
      (assignment) =>
        assignment.state === "NOT_DUE",
    ).length;

  if (variant === "dashboard") {
    return (
      <section
        className={`rounded-3xl border-2 p-6 shadow-sm ${
          pending.length > 0
            ? "border-red-300 bg-red-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p
              className={`text-xs font-black uppercase tracking-[0.16em] ${
                pending.length > 0
                  ? "text-red-700"
                  : "text-emerald-700"
              }`}
            >
              {pending.length > 0
                ? "MISSING WORK"
                : "YOU ARE CURRENT"}
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              {pending.length > 0
                ? `${pending.length} required ${
                    pending.length === 1
                      ? "assignment needs"
                      : "assignments need"
                  } your attention`
                : "No required released work is currently missing"}
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-700">
              Red X = currently incomplete.
              Green = submitted. Blue or gray =
              not due yet or no required work.
            </p>

            {futureCount > 0 ? (
              <p className="mt-3 text-sm font-black text-sky-800">
                {futureCount} released required{" "}
                {futureCount === 1
                  ? "assignment is"
                  : "assignments are"}{" "}
                not due yet and will not count
                as missing before the effective
                due date.
              </p>
            ) : null}

            {pending.length > 0 ? (
              <p className="mt-3 text-sm font-black text-red-700">
                Friday 8:00 AM reminder:
                currently missing work is emailed
                to you. Work from that reminder
                still missing the following Monday
                results in a 30 participation-point
                deduction. Approved deadline
                accommodations are applied first.
              </p>
            ) : null}

            {accountability.support.planActive &&
            accountability.support
                .extendedDeadlineDays > 0 ? (
              <p className="mt-3 rounded-xl bg-white/80 px-3 py-2 text-sm font-black text-[#4B2265]">
                Approved deadline support active:
                {" "}+
                {
                  accountability.support
                    .extendedDeadlineDays
                }{" "}
                {accountability.support
                  .extendedDeadlineDays === 1
                  ? "day"
                  : "days"}{" "}
                is applied to assignment due dates.
              </p>
            ) : null}

            {accountability
              .participationPointsLost > 0 ? (
              <p className="mt-3 text-sm font-black text-[#725500]">
                Participation points deducted
                to date:{" "}
                {
                  accountability
                    .participationPointsLost
                }
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href={`/ambassador/student-portal/${studentId}/assignments`}
              className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
            >
              Review All Work
            </Link>
            <Link
              href={`/ambassador/student-portal/${studentId}/how-to-use-my-portal`}
              className="rounded-xl border border-[#0D1B3D] bg-white px-5 py-3 text-sm font-black text-[#0D1B3D]"
            >
              How to Use My Portal
            </Link>
          </div>
        </div>

        {pending.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {pending
              .slice(0, 5)
              .map((assignment) => (
                <Link
                  key={assignment.id}
                  href={assignmentHref(
                    studentId,
                    assignment,
                  )}
                  className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-white p-4 transition hover:border-red-400 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-red-700">
                      X Week{" "}
                      {assignment.weekNumber}
                      {assignment.dayNumber
                        ? ` - Day ${assignment.dayNumber}`
                        : ""}
                    </p>
                    <p className="mt-1 font-black text-[#0D1B3D]">
                      {assignment.title}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {assignment.status ===
                      "DRAFT"
                        ? "Draft saved - still not submitted"
                        : assignment.status ===
                              "NEEDS_REVISION" ||
                            assignment.status ===
                              "REJECTED"
                          ? "Action required before this counts as complete"
                          : "Not submitted"}
                    </p>
                  </div>
                  <span className="font-black text-red-700">
                    COMPLETE NOW
                  </span>
                </Link>
              ))}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            MY WORK STATUS
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Weeks, Days & Assignments
          </h2>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            Red X = currently incomplete.
            Green = submitted. Blue or gray =
            not due yet or no required assignment.
            Approved deadline supports are included
            in the effective due date.
          </p>
        </div>

        <Link
          href={`/ambassador/student-portal/${studentId}/how-to-use-my-portal`}
          className="shrink-0 rounded-xl border border-[#0D1B3D] px-5 py-3 text-sm font-black text-[#0D1B3D]"
        >
          Portal Directions
        </Link>
      </div>

      <div className="mt-6 space-y-5">
        {accountability.weeks.map((week) => (
          <article
            key={week.lessonId}
            className={`rounded-2xl border p-5 ${
              week.state === "NO_WORK" ||
              week.state === "NOT_DUE"
                ? "border-slate-200 bg-slate-50"
                : week.state === "COMPLETE"
                  ? "border-emerald-200 bg-emerald-50/50"
                  : "border-red-200 bg-red-50/50"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Week {week.weekNumber}
                </p>
                <h3 className="mt-1 text-xl font-black text-[#0D1B3D]">
                  {week.title}
                </h3>
              </div>

              <StatusPill
                state={week.state}
                completeLabel="WEEK COMPLETE"
                missingLabel="WEEK INCOMPLETE"
              />
            </div>

            <div className="mt-4 space-y-3">
              {week.days.map((day) => (
                <div
                  key={`${week.lessonId}-${day.dayNumber ?? "week"}`}
                  className="rounded-xl border border-white bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black text-[#0D1B3D]">
                      {day.label}
                    </p>
                    <StatusPill
                      state={day.state}
                      completeLabel="DAY COMPLETE"
                      missingLabel="DAY INCOMPLETE"
                    />
                  </div>

                  <div className="mt-3 grid gap-2">
                    {day.assignments.map(
                      (assignment) => (
                        <Link
                          key={assignment.id}
                          href={assignmentHref(
                            studentId,
                            assignment,
                          )}
                          className={`flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between ${
                            assignment.state ===
                            "COMPLETE"
                              ? "border-emerald-100 bg-emerald-50"
                              : assignment.state ===
                                  "NOT_DUE"
                                ? "border-sky-100 bg-sky-50"
                                : "border-red-100 bg-red-50"
                          }`}
                        >
                          <div>
                            <p className="font-black text-[#0D1B3D]">
                              {assignment.title}
                            </p>

                            {assignment.state ===
                              "NOT_DUE" &&
                            assignment.dueAt ? (
                              <p className="mt-1 text-xs font-bold text-sky-800">
                                Effective due date:{" "}
                                {formatDate(
                                  assignment.dueAt,
                                )}
                              </p>
                            ) : null}
                          </div>

                          <StatusPill
                            state={assignment.state}
                            completeLabel="SUBMITTED"
                            missingLabel="NOT COMPLETE"
                          />
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
