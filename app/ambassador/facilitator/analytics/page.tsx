import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function average(values: number[]) {
  if (values.length === 0) return 0;

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length
  );
}

export default async function FacilitatorAnalyticsPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (
    session.role !== "FACILITATOR" &&
    session.role !== "SCHOOL_ADMIN" &&
    session.role !== "ORGANIZATION_ADMIN" &&
    session.role !== "SUPER_ADMIN"
  ) {
    redirect("/ambassador");
  }

  let cohortIds: string[] | undefined;

  if (session.role === "FACILITATOR") {
    const facilitator = await prisma.facilitator.findUnique({
      where: {
        userId: session.id,
      },
      select: {
        cohorts: {
          select: {
            cohortId: true,
          },
        },
      },
    });

    cohortIds =
      facilitator?.cohorts.map((item) => item.cohortId) ?? [];
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      status: "ACTIVE",

      ...(cohortIds
        ? {
            cohortId: {
              in: cohortIds,
            },
          }
        : {}),

      ...(session.role === "SCHOOL_ADMIN" && session.schoolId
        ? {
            cohort: {
              schoolId: session.schoolId,
            },
          }
        : {}),

      ...(session.role === "ORGANIZATION_ADMIN" &&
      session.organizationId
        ? {
            cohort: {
              organizationId: session.organizationId,
            },
          }
        : {}),
    },

    orderBy: {
      enrolledAt: "desc",
    },

    select: {
      id: true,

      cohort: {
        select: {
          id: true,
          name: true,
          code: true,

          program: {
            select: {
              id: true,
              name: true,
              totalWeeks: true,
            },
          },
        },
      },

      student: {
        select: {
          id: true,
          readinessScore: true,
          profileComplete: true,

          user: {
            select: {
              firstName: true,
              lastName: true,
              displayName: true,
              email: true,
            },
          },

          lessonProgress: {
            select: {
              percent: true,
              completedAt: true,

              lesson: {
                select: {
                  module: {
                    select: {
                      programId: true,
                    },
                  },
                },
              },
            },
          },

          portfolio: {
            select: {
              artifacts: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const students = enrollments.map((enrollment) => {
    const student = enrollment.student;

    const relevantProgress = student.lessonProgress.filter(
      (item) =>
        item.lesson.module.programId ===
        enrollment.cohort.program.id
    );

    const progress =
      relevantProgress.length > 0
        ? average(
            relevantProgress.map((item) =>
              Math.round(Number(item.percent))
            )
          )
        : 0;

    const completedLessons = relevantProgress.filter(
      (item) => item.completedAt
    ).length;

    return {
      id: student.id,

      name:
        student.user.displayName ||
        `${student.user.firstName} ${student.user.lastName}`.trim(),

      email: student.user.email,

      cohortName: enrollment.cohort.name,
      cohortCode: enrollment.cohort.code,

      progress,
      completedLessons,

      readiness: Math.round(Number(student.readinessScore)),

      artifacts:
        student.portfolio?.artifacts.length ?? 0,

      profileComplete: student.profileComplete,
    };
  });

  const cohorts = Array.from(
    new Map(
      enrollments.map((enrollment) => [
        enrollment.cohort.id,
        enrollment.cohort,
      ])
    ).values()
  );

  const studentsAssessed = students.filter(
    (student) => student.readiness > 0
  ).length;

  const averageProgress = average(
    students.map((student) => student.progress)
  );

  const assessedStudents = students.filter(
    (student) => student.readiness > 0
  );

  const averageReadiness = average(
    assessedStudents.map((student) => student.readiness)
  );

  const totalArtifacts = students.reduce(
    (total, student) => total + student.artifacts,
    0
  );

  const profilesComplete = students.filter(
    (student) => student.profileComplete
  ).length;

  const studentsNeedingSupport = students.filter(
    (student) =>
      student.progress < 50 ||
      (student.readiness > 0 && student.readiness < 60)
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          ANALYTICS
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Cohort Progress + Readiness
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          One facilitator view of student participation, curriculum
          progress, readiness, profile completion and portfolio evidence.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Active Students"
          value={String(students.length)}
          detail={`${cohorts.length} active cohort${
            cohorts.length === 1 ? "" : "s"
          }`}
        />

        <Metric
          label="Average Progress"
          value={`${averageProgress}%`}
          detail="Across current program activity"
        />

        <Metric
          label="Readiness Assessed"
          value={`${studentsAssessed}/${students.length}`}
          detail={
            studentsAssessed > 0
              ? `${averageReadiness}% average readiness`
              : "No readiness scores yet"
          }
        />

        <Metric
          label="Portfolio Evidence"
          value={String(totalArtifacts)}
          detail={`${profilesComplete}/${students.length} profiles complete`}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
              STUDENT PROGRESS
            </p>

            <h2 className="mt-1 text-xl font-black text-[#0D1B3D]">
              Cohort Snapshot
            </h2>
          </div>

          <Link
            href="/ambassador/facilitator/students"
            className="text-sm font-black text-[#007C7C]"
          >
            Open Student Records →
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-black text-[#0D1B3D]">
              No active students found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((student) => (
              <article
                key={`${student.cohortCode}-${student.id}`}
                className="grid gap-5 p-5 md:grid-cols-[1.5fr_repeat(4,minmax(110px,1fr))] md:items-center"
              >
                <div>
                  <p className="font-black text-[#0D1B3D]">
                    {student.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {student.cohortName}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {student.email}
                  </p>
                </div>

                <StudentMetric
                  label="Progress"
                  value={`${student.progress}%`}
                />

                <StudentMetric
                  label="Readiness"
                  value={
                    student.readiness > 0
                      ? `${student.readiness}%`
                      : "—"
                  }
                />

                <StudentMetric
                  label="Evidence"
                  value={String(student.artifacts)}
                />

                <StudentMetric
                  label="Profile"
                  value={
                    student.profileComplete
                      ? "Complete"
                      : "Incomplete"
                  }
                />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#007C7C]">
            COHORTS
          </p>

          <h2 className="mt-1 text-xl font-black text-[#0D1B3D]">
            Program Delivery
          </h2>

          <div className="mt-4 space-y-3">
            {cohorts.map((cohort) => {
              const cohortStudents = students.filter(
                (student) =>
                  student.cohortCode === cohort.code
              );

              return (
                <div
                  key={cohort.id}
                  className="rounded-xl bg-slate-50 p-4"
                >
                  <p className="font-black text-[#0D1B3D]">
                    {cohort.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {cohortStudents.length} students ·{" "}
                    {average(
                      cohortStudents.map(
                        (student) => student.progress
                      )
                    )}
                    % average progress
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">
            SUPPORT VIEW
          </p>

          <h2 className="mt-1 text-xl font-black text-[#0D1B3D]">
            Students to Review
          </h2>

          {studentsNeedingSupport.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No students currently meet the basic progress/readiness
              review threshold.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {studentsNeedingSupport.map((student) => (
                <div
                  key={`support-${student.id}`}
                  className="rounded-xl bg-amber-50 p-4"
                >
                  <p className="font-black text-[#0D1B3D]">
                    {student.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {student.progress}% progress
                    {student.readiness > 0
                      ? ` · ${student.readiness}% readiness`
                      : " · readiness not completed"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-bold text-[#0D1B3D]">
          Analytics are calculated from the same live student,
          enrollment, readiness, lesson-progress and portfolio records
          already used by the facilitator dashboard.
        </p>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function StudentMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-black text-[#0D1B3D]">
        {value}
      </p>
    </div>
  );
}
