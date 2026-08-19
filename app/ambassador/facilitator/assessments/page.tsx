import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  DAY_ONE_QUESTIONS,
  READINESS_SCALE,
} from "@/content/day-one-readiness";

const COHORT_CODE = "PILOT-2026-2027";

const CATEGORY_LABELS: Record<string, string> = {
  SELF_AWARENESS: "Self Awareness",
  COMMUNICATION: "Communication",
  LEADERSHIP: "Leadership",
  PROFESSIONAL_PRESENCE: "Professional Presence",
  CAREER_READINESS: "Career Readiness",
  ADAPTABILITY: "Adaptability",
  AI_READINESS: "AI Readiness",
};

function scoreLabel(score: number) {
  return READINESS_SCALE.find((item) => item.value === score)?.label ?? "—";
}

function studentName(student: {
  user: {
    firstName: string;
    lastName: string;
    displayName: string | null;
  };
}) {
  return (
    student.user.displayName ||
    `${student.user.firstName} ${student.user.lastName}`.trim()
  );
}

export const dynamic = "force-dynamic";

export default async function AssessmentsPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (
    session.role !== "SUPER_ADMIN" &&
    session.role !== "ORGANIZATION_ADMIN" &&
    session.role !== "SCHOOL_ADMIN" &&
    session.role !== "FACILITATOR"
  ) {
    redirect("/ambassador");
  }

  const cohort = await prisma.cohort.findFirst({
    where: {
      code: COHORT_CODE,
      deletedAt: null,
    },
    select: {
      name: true,
      enrollments: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          enrolledAt: "asc",
        },
        select: {
          student: {
            select: {
              id: true,
              readinessScore: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  displayName: true,
                  email: true,
                },
              },
              readinessProfile: {
                select: {
                  selfAwareness: true,
                  communication: true,
                  leadership: true,
                  professionalPresence: true,
                  careerReadiness: true,
                  adaptability: true,
                  aiReadiness: true,
                  completedAt: true,
                },
              },
              readinessResponses: {
                orderBy: {
                  question: {
                    position: "asc",
                  },
                },
                select: {
                  score: true,
                  response: true,
                  question: {
                    select: {
                      position: true,
                      category: true,
                      question: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cohort) {
    return <p>Ambassador cohort not found.</p>;
  }

  const students = cohort.enrollments.map(({ student }) => ({
    ...student,
    name: studentName(student),
  }));

  const completedCount = students.filter(
    (student) => student.readinessProfile?.completedAt,
  ).length;

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-7 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          ASSESSMENTS
        </p>

        <h1 className="mt-2 text-3xl font-black">Day 1 Readiness Results</h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          A read-only class view of the readiness assessment students completed
          at the beginning of Future Ready™.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            {cohort.name}
          </span>

          <span className="rounded-full bg-[#F2B705] px-4 py-2 text-sm font-black text-[#0D1B3D]">
            {completedCount} of {students.length} complete
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
            CLASS SHEET
          </p>

          <h2 className="mt-2 text-xl font-black text-[#0D1B3D]">
            Readiness Snapshot
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Use this view to quickly compare student readiness across the seven
            Future Ready™ categories.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1250px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-50 px-4 py-4">
                  Student
                </th>
                <th className="border-b border-slate-200 px-4 py-4">Status</th>
                <th className="border-b border-slate-200 px-4 py-4">Overall</th>
                <th className="border-b border-slate-200 px-4 py-4">
                  Self Awareness
                </th>
                <th className="border-b border-slate-200 px-4 py-4">
                  Communication
                </th>
                <th className="border-b border-slate-200 px-4 py-4">
                  Leadership
                </th>
                <th className="border-b border-slate-200 px-4 py-4">
                  Professional Presence
                </th>
                <th className="border-b border-slate-200 px-4 py-4">
                  Career Readiness
                </th>
                <th className="border-b border-slate-200 px-4 py-4">
                  Adaptability
                </th>
                <th className="border-b border-slate-200 px-4 py-4">
                  AI Readiness
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                const profile = student.readinessProfile;
                const completed = Boolean(profile?.completedAt);

                return (
                  <tr key={student.id} className="border-b border-slate-100">
                    <td className="sticky left-0 border-r border-slate-200 bg-white px-4 py-4">
                      <p className="font-black text-[#0D1B3D]">
                        {student.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {student.user.email}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          completed
                            ? "rounded-full bg-[#EAFBFB] px-3 py-2 text-xs font-black text-[#007C7C]"
                            : "rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-500"
                        }
                      >
                        {completed
                          ? "Completed"
                          : student.readinessResponses.length > 0
                            ? "In Progress"
                            : "Not Started"}
                      </span>
                    </td>

                    <ScoreCell
                      value={
                        completed
                          ? Math.round(Number(student.readinessScore))
                          : null
                      }
                      emphasize
                    />

                    <ScoreCell
                      value={
                        profile
                          ? Math.round(Number(profile.selfAwareness))
                          : null
                      }
                    />

                    <ScoreCell
                      value={
                        profile
                          ? Math.round(Number(profile.communication))
                          : null
                      }
                    />

                    <ScoreCell
                      value={
                        profile ? Math.round(Number(profile.leadership)) : null
                      }
                    />

                    <ScoreCell
                      value={
                        profile
                          ? Math.round(Number(profile.professionalPresence))
                          : null
                      }
                    />

                    <ScoreCell
                      value={
                        profile
                          ? Math.round(Number(profile.careerReadiness))
                          : null
                      }
                    />

                    <ScoreCell
                      value={
                        profile
                          ? Math.round(Number(profile.adaptability))
                          : null
                      }
                    />

                    <ScoreCell
                      value={
                        profile ? Math.round(Number(profile.aiReadiness)) : null
                      }
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
            STUDENT ANSWERS
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Question-by-Question Responses
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Open a student only when you need the detailed response sheet.
          </p>
        </div>

        {students.map((student) => (
          <details
            key={student.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <summary className="cursor-pointer list-none p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-black text-[#0D1B3D]">{student.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {student.readinessResponses.length} of{" "}
                    {DAY_ONE_QUESTIONS.length} responses
                  </p>
                </div>

                <span className="rounded-xl bg-[#0D1B3D] px-4 py-2 text-xs font-black text-white">
                  View Answers
                </span>
              </div>
            </summary>

            <div className="border-t border-slate-200">
              {student.readinessResponses.length === 0 ? (
                <p className="p-5 text-sm text-slate-500">
                  This student has not submitted assessment responses yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="border-b border-slate-200 px-4 py-3">
                          #
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3">
                          Category
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3">
                          Question
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3">
                          Score
                        </th>
                        <th className="border-b border-slate-200 px-4 py-3">
                          Response
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {student.readinessResponses.map((response) => (
                        <tr
                          key={`${student.id}-${response.question.position}`}
                          className="border-b border-slate-100 align-top"
                        >
                          <td className="px-4 py-4 font-black text-slate-400">
                            {response.question.position}
                          </td>

                          <td className="px-4 py-4 font-bold text-[#4B2265]">
                            {CATEGORY_LABELS[response.question.category] ??
                              response.question.category}
                          </td>

                          <td className="max-w-xl px-4 py-4 leading-6 text-[#0D1B3D]">
                            {response.question.question}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex min-w-10 justify-center rounded-lg bg-[#FFF9DF] px-3 py-2 font-black text-[#725500]">
                              {response.score}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-600">
                            <p className="font-bold text-[#0D1B3D]">
                              {scoreLabel(response.score)}
                            </p>

                            {response.response ? (
                              <p className="mt-1 whitespace-pre-wrap leading-6">
                                {response.response}
                              </p>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </details>
        ))}
      </section>

      <p className="text-sm font-bold text-slate-500">
        Read-only view. Student assessment records are not changed from this
        page.
      </p>
    </main>
  );
}

function ScoreCell({
  value,
  emphasize = false,
}: {
  value: number | null;
  emphasize?: boolean;
}) {
  return (
    <td className="px-4 py-4">
      {value === null ? (
        <span className="text-slate-400">—</span>
      ) : (
        <span
          className={
            emphasize
              ? "inline-flex rounded-lg bg-[#0D1B3D] px-3 py-2 font-black text-white"
              : "font-black text-[#0D1B3D]"
          }
        >
          {value}%
        </span>
      )}
    </td>
  );
}
