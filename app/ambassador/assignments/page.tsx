"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SubmissionSummary = {
  enrolledStudentCount?: number;
  draftCount?: number;
  submittedCount?: number;
  approvedCount?: number;
  completedCount?: number;
};

type Assignment = {
  id: string;
  title: string;
  instructions?: string | null;
  dayNumber?: number | null;
  status?: string | null;
  estimatedMinutes?: number | null;
  portfolioEligible?: boolean;
  submissionSummary?: SubmissionSummary;
};

type WeekResult = {
  week: number;
  loading: boolean;
  error?: string;
  lesson?: {
    id?: string;
    weekNumber?: number;
    title?: string;
    summary?: string;
  };
  delivery?: unknown;
  assignments: Assignment[];
};

const WEEKS = Array.from({ length: 16 }, (_, index) => index + 1);

function hasThursdayExperience(delivery: unknown) {
  const text = JSON.stringify(
    (delivery as { thursday?: unknown } | null)?.thursday ?? {},
  ).toLowerCase();

  return [
    "speaker",
    "visit",
    "tour",
    "field trip",
    "experience",
    "professional",
    "employer",
    "company",
    "workplace",
  ].some((term) => text.includes(term));
}

function dayLabel(dayNumber?: number | null) {
  switch (dayNumber) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    default:
      return "Shared / Weekly";
  }
}

function plannedWeekRhythm(week: number, experience: boolean) {
  if (week === 15) {
    return [
      {
        day: "Week 15",
        title: "Thanksgiving Break",
        detail: "No required assignment or make-up assignment.",
      },
    ];
  }

  const rows = [];

  if (week >= 3) {
    rows.push({
      day: "Monday",
      title: `Week ${week} Workbook · Monday Launch`,
      detail:
        "Open the weekly BUILD6™ workbook, review the week's focus, begin the Monday section, and organize what is due.",
    });

    rows.push({
      day: "Tuesday",
      title: `Week ${week} Workbook · Tuesday / Day 2`,
      detail:
        "Complete the exact Day 2 workbook activity aligned with Tuesday's lesson.",
    });
  } else {
    rows.push({
      day: "Monday–Tuesday",
      title: "Foundation work",
      detail:
        "Use the protected Week 1–2 assignments already saved for the cohort. Workbook cadence becomes required beginning Week 3.",
    });
  }

  rows.push({
    day: "Wednesday",
    title: experience
      ? `Week ${week} · Research + Prepare + Activity`
      : `Week ${week} · Applied Activity`,
    detail: experience
      ? "Complete the Wednesday workbook work, research Thursday's speaker/company/host, identify what the organization does, roles and careers, products/services or customers, and prepare at least 3 informed questions. Complete a related preparation activity and save meaningful evidence."
      : "Complete the Wednesday applied lesson/activity and save meaningful research, decisions, examples, or evidence when appropriate.",
  });

  rows.push({
    day: "Thursday",
    title: experience
      ? `Week ${week} · Speaker / Field Experience`
      : `Week ${week} · Thursday Application`,
    detail: experience
      ? "Use Wednesday's research and questions during the speaker, tour, field trip, employer visit, or professional experience. Capture answers, career roles, workplace observations, skills, pathways, and takeaways."
      : "Complete Thursday's application work tied directly to the week's lesson and real-world practice.",
  });

  rows.push({
    day: "Friday",
    title: experience
      ? `Week ${week} · Thank-You + Reflection`
      : `Week ${week} · Reflection + Closeout`,
    detail: experience
      ? "Write a professional thank-you note or follow-up to the speaker, host, company, or experience partner. Complete the Friday reflection, check all required work, and save the strongest evidence for Passport / portfolio / capstone use."
      : "Complete the Friday reflection and weekly closeout, verify required assignments are submitted, and save meaningful evidence for Passport / portfolio / capstone use.",
  });

  return rows;
}

function completionText(summary?: SubmissionSummary) {
  if (!summary) return "No completion data";

  const completed = summary.completedCount ?? 0;
  const enrolled = summary.enrolledStudentCount ?? 0;

  return `${completed} / ${enrolled} complete`;
}

export default function AmbassadorAssignmentsPage() {
  const [weeks, setWeeks] = useState<WeekResult[]>(
    WEEKS.map((week) => ({
      week,
      loading: true,
      assignments: [],
    })),
  );

  const [removingAssignmentId, setRemovingAssignmentId] =
    useState<string | null>(null);

  const [assignmentMessage, setAssignmentMessage] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const results = await Promise.all(
        WEEKS.map(async (week): Promise<WeekResult> => {
          try {
            const response = await fetch(
              `/api/ambassador/teaching-hub?week=${week}`,
              {
                cache: "no-store",
              },
            );

            if (!response.ok) {
              return {
                week,
                loading: false,
                assignments: [],
                error: `Could not load Week ${week}`,
              };
            }

            const result = await response.json();

            return {
              week,
              loading: false,
              lesson: result.lesson ?? undefined,
              delivery: result.delivery,
              assignments: Array.isArray(result.assignments)
                ? result.assignments
                : [],
            };
          } catch {
            return {
              week,
              loading: false,
              assignments: [],
              error: `Could not load Week ${week}`,
            };
          }
        }),
      );

      if (!cancelled) {
        setWeeks(results);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function removeFromActivePlan(
    weekNumber: number,
    lessonId: string | undefined,
    assignment: Assignment,
  ) {
    if (!lessonId) {
      setAssignmentMessage(
        `Could not identify the lesson for Week ${weekNumber}. Nothing was changed.`,
      );
      return;
    }

    const completed =
      assignment.submissionSummary?.completedCount ?? 0;

    const drafts =
      assignment.submissionSummary?.draftCount ?? 0;

    const confirmed = window.confirm(
      `Remove "${assignment.title}" from the active Week ${weekNumber} assignment plan?\n\n` +
        `Student protection:\n` +
        `• Drafts are preserved.\n` +
        `• Submitted/approved work is preserved.\n` +
        `• Uploaded evidence and portfolio/capstone connections are preserved.\n` +
        `• Students with existing work keep access to that preserved work.\n` +
        `• Students who never started this assignment will no longer see it.\n\n` +
        `Current records: ${drafts} draft(s), ${completed} completed submission(s).`,
    );

    if (!confirmed) return;

    setRemovingAssignmentId(assignment.id);
    setAssignmentMessage(null);

    try {
      const response = await fetch("/api/ambassador/teaching-hub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId,
          action: "deleteAssignment",
          assignmentId: assignment.id,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : `Server returned ${response.status}`,
        );
      }

      setWeeks((current) =>
        current.map((week) =>
          week.week === weekNumber
            ? {
                ...week,
                assignments: week.assignments.map((item) =>
                  item.id === assignment.id
                    ? {
                        ...item,
                        status: "ARCHIVED",
                      }
                    : item,
                ),
              }
            : week,
        ),
      );

      const preserved =
        typeof result.preservedSubmissionCount === "number"
          ? result.preservedSubmissionCount
          : 0;

      setAssignmentMessage(
        `"${assignment.title}" was removed from the active plan. ` +
          `${preserved} student submission record(s) remain preserved.`,
      );
    } catch (error) {
      setAssignmentMessage(
        error instanceof Error
          ? error.message
          : "Could not remove the assignment.",
      );
    } finally {
      setRemovingAssignmentId(null);
    }
  }

  const totals = useMemo(() => {
    let active = 0;
    let completed = 0;

    for (const week of weeks) {
      for (const assignment of week.assignments) {
        if (assignment.status !== "ARCHIVED") {
          active += 1;
        }

        completed += assignment.submissionSummary?.completedCount ?? 0;
      }
    }

    return { active, completed };
  }, [weeks]);

  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-[#0D1B3D] p-7 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          BUILD6™ · ASSIGNMENTS
        </p>

        <h1 className="mt-2 text-3xl font-black">
          16-Week Student Work Overview
        </h1>

        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">
          View the entire program assignment plan in one place. Existing student
          submissions, completed work, uploaded evidence, portfolio items, and
          archived assignment history remain preserved in student portals.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">
            16 Weeks
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">
            {totals.active} Active Assignments
          </span>

          <span className="rounded-full bg-[#F2B705] px-4 py-2 text-sm font-black text-[#0D1B3D]">
            {totals.completed} Student Completions
          </span>
        </div>
      </section>

      {assignmentMessage ? (
        <section className="rounded-2xl border border-[#00A6A6]/30 bg-[#EAFBFB] p-4 text-sm font-bold text-[#0D1B3D]">
          {assignmentMessage}
        </section>
      ) : null}

      <section className="rounded-3xl border border-[#F2B705]/40 bg-[#FFF9DF] p-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
          LOCKED BUILD6™ ASSIGNMENT RHYTHM
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {[
            ["MON", "Workbook launch"],
            ["TUE", "Workbook activity"],
            ["WED", "Research + prepare + activity"],
            ["THU", "Speaker / field experience when scheduled"],
            ["FRI", "Thank-you + reflection"],
          ].map(([day, text]) => (
            <div
              key={day}
              className="rounded-2xl border border-[#F2B705]/30 bg-white p-4"
            >
              <p className="text-xs font-black text-[#725500]">{day}</p>
              <p className="mt-2 text-sm font-bold text-[#0D1B3D]">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm font-bold leading-6 text-[#0D1B3D]">
          Beginning Week 3, every instructional week includes a workbook.
          Whenever Thursday includes a speaker, company visit, field trip, tour,
          employer, or professional experience, Wednesday is research,
          preparation, and an activity; Friday is the professional thank-you /
          follow-up and reflection.
        </p>
      </section>

      <div className="space-y-6">
        {weeks.map((week) => {
          const experience = hasThursdayExperience(week.delivery);
          const rhythm = plannedWeekRhythm(week.week, experience);

          const activeAssignments = week.assignments.filter(
            (assignment) => assignment.status !== "ARCHIVED",
          );

          const archivedAssignments = week.assignments.filter(
            (assignment) => assignment.status === "ARCHIVED",
          );

          return (
            <section
              key={week.week}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
                    WEEK {week.week}
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                    {week.lesson?.title || `Week ${week.week}`}
                  </h2>

                  {week.week >= 3 && week.week !== 15 ? (
                    <p className="mt-2 text-sm font-black text-[#007C7C]">
                      ✓ Weekly workbook required
                    </p>
                  ) : null}

                  {experience ? (
                    <p className="mt-1 text-sm font-black text-[#4B2265]">
                      ✓ Thursday professional experience detected
                    </p>
                  ) : null}
                </div>

                <Link
                  href={`/ambassador/curriculum?section=assignments&week=${week.week}`}
                  className="rounded-xl bg-[#0D1B3D] px-4 py-3 text-xs font-black text-white"
                >
                  Manage Week {week.week}
                </Link>
              </div>

              <div className="grid gap-6 p-6 xl:grid-cols-2">
                <div>
                  <h3 className="text-lg font-black text-[#0D1B3D]">
                    BUILD6™ Weekly Plan
                  </h3>

                  <div className="mt-4 space-y-3">
                    {rhythm.map((item) => (
                      <div
                        key={`${week.week}-${item.day}`}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="text-xs font-black uppercase tracking-wide text-[#4B2265]">
                          {item.day}
                        </p>

                        <p className="mt-1 font-black text-[#0D1B3D]">
                          {item.title}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#0D1B3D]">
                    Saved Assignments + Student Completion
                  </h3>

                  {week.loading ? (
                    <p className="mt-4 text-sm font-bold text-slate-500">
                      Loading Week {week.week}…
                    </p>
                  ) : week.error ? (
                    <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                      {week.error}
                    </p>
                  ) : activeAssignments.length === 0 ? (
                    <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                      No active saved assignments are currently attached to this
                      week. Existing archived/submitted student history is not
                      modified by this overview.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {activeAssignments.map((assignment) => (
                        <article
                          key={assignment.id}
                          className="rounded-2xl border border-slate-200 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-wide text-[#007C7C]">
                                {dayLabel(assignment.dayNumber)}
                              </p>

                              <h4 className="mt-1 font-black text-[#0D1B3D]">
                                {assignment.title}
                              </h4>
                            </div>

                            <span className="rounded-full bg-[#EAF7F7] px-3 py-2 text-xs font-black text-[#007C7C]">
                              {completionText(assignment.submissionSummary)}
                            </span>
                          </div>

                          {assignment.instructions ? (
                            <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {assignment.instructions}
                            </p>
                          ) : null}

                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                            {assignment.estimatedMinutes ? (
                              <span>{assignment.estimatedMinutes} min</span>
                            ) : null}

                            {assignment.portfolioEligible ? (
                              <span>• Portfolio / Capstone eligible</span>
                            ) : null}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                            <Link
                              href={`/ambassador/curriculum?section=assignments&week=${week.week}&editAssignment=${encodeURIComponent(
                                assignment.id,
                              )}`}
                              className="rounded-xl border border-[#0D1B3D] bg-white px-4 py-2.5 text-xs font-black text-[#0D1B3D]"
                            >
                              ✏️ Edit Assignment
                            </Link>

                            <button
                              type="button"
                              disabled={
                                removingAssignmentId === assignment.id ||
                                !week.lesson?.id
                              }
                              onClick={() =>
                                void removeFromActivePlan(
                                  week.week,
                                  week.lesson?.id,
                                  assignment,
                                )
                              }
                              className="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {removingAssignmentId === assignment.id
                                ? "Removing..."
                                : "🗂 Remove from Active Plan"}
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  {archivedAssignments.length > 0 ? (
                    <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <summary className="cursor-pointer text-sm font-black text-slate-600">
                        Preserved / Archived · {archivedAssignments.length}
                      </summary>

                      <div className="mt-3 space-y-2">
                        {archivedAssignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="rounded-xl bg-white p-3 text-sm"
                          >
                            <p className="font-black text-[#0D1B3D]">
                              {assignment.title}
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-500">
                              {completionText(assignment.submissionSummary)} ·
                              Student history preserved
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
        <strong className="text-[#0D1B3D]">Preservation rule:</strong>{" "}
        This overview does not delete or rewrite student work. Existing
        submitted assignments, drafts, uploaded evidence, reflections,
        portfolio/capstone connections, and archived history remain preserved.
      </section>
    </main>
  );
}
