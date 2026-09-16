import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StudentAccountabilityPanel from "@/components/student/StudentAccountabilityPanel";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AmbassadorStudentPortalPage({
  params,
}: PageProps) {
  const { id } = await params;

  const access = await authorizeStudentAccess(id);

  if (!access.allowed) {
    if (access.status === 401) {
      redirect("/ambassador/login");
    }

    if (access.status === 404) {
      notFound();
    }

    redirect("/student-portal");
  }

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      gradeLevel: true,
      graduationYear: true,
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

      school: {
        select: {
          name: true,
        },
      },

      enrollments: {
        where: {
          status: "ACTIVE",
        },
        select: {
          cohort: {
            select: {
              id: true,
              name: true,
              program: {
                select: {
                  id: true,
                  name: true,
                  totalWeeks: true,
                },
              },
            },
          },
        },
        take: 1,
      },

      lessonProgress: {
        select: {
          lessonId: true,
          percent: true,
          completedAt: true,
          lesson: {
            select: {
              weekNumber: true,
              title: true,
              module: {
                select: {
                  programId: true,
                },
              },
            },
          },
        },
      },

      reflections: {
        select: {
          id: true,
          status: true,
        },
      },

      portfolio: {
        select: {
          id: true,
          artifacts: {
            select: {
              id: true,
              approval: true,
            },
          },
        },
      },

      profile: {
        select: {
          id: true,
        },
      },

      readinessProfile: {
        select: {
          completedAt: true,
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  const enrollment = student.enrollments[0];

  const cohort = enrollment?.cohort ?? null;

  const program = cohort?.program ?? null;

  const programId = program?.id ?? null;

  const releasedLessons =
    programId && cohort
      ? await prisma.lesson.findMany({
          where: {
            module: {
              programId,
            },
            status: "ACTIVE",
          },
          select: {
            id: true,
            weekNumber: true,
            title: true,
          },
          orderBy: {
            weekNumber: "asc",
          },
        })
      : [];

  const programProgress = programId
    ? student.lessonProgress.filter(
        (progress) => progress.lesson.module.programId === programId,
      )
    : [];

  const completedLessons = programProgress.filter(
    (progress) => progress.completedAt !== null || progress.percent >= 100,
  ).length;

  const currentReleasedLesson =
    releasedLessons.find((releasedLesson) => {
      const progress = programProgress.find(
        (item) => item.lessonId === releasedLesson.id,
      );

      return (
        !progress || (progress.completedAt === null && progress.percent < 100)
      );
    }) ??
    releasedLessons[releasedLessons.length - 1] ??
    null;

  const currentWeek = currentReleasedLesson?.weekNumber ?? null;

  const totalWeeks = program?.totalWeeks ?? 0;

  const progressPercent =
    totalWeeks > 0
      ? Math.min(100, Math.round((completedLessons / totalWeeks) * 100))
      : 0;

  const portfolioArtifacts = student.portfolio?.artifacts.length ?? 0;

  const submittedReflections = student.reflections.filter(
    (reflection) => reflection.status === "SUBMITTED",
  ).length;

  const studentName =
    student.user.displayName ??
    `${student.user.firstName} ${student.user.lastName}`.trim();

  const firstName =
    student.user.firstName ||
    studentName.split(" ")[0] ||
    "Future Ready student";

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-7 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          STUDENT DASHBOARD
        </p>

        <h1 className="mt-3 text-4xl font-black">Welcome, {firstName}</h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200">
          See what matters right now, continue your weekly work, and build the
          story of who you are becoming.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Progress"
          value={`${progressPercent}%`}
          detail={`${completedLessons} lessons complete`}
        />

        <StatCard
          label="Readiness"
          value={`${Math.round(Number(student.readinessScore))}%`}
          detail={
            student.readinessProfile?.completedAt
              ? "baseline complete"
              : "assessment needed"
          }
        />

        <StatCard
          label="Evidence"
          value={String(portfolioArtifacts)}
          detail="saved pieces"
        />
      </section>

      {!student.readinessProfile?.completedAt ? (
        <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
                NEEDS YOUR ATTENTION
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
                Complete your Day 1 assessment
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                This gives you a starting point. It is not a grade.
              </p>
            </div>

            <Link
              href={`/ambassador/student-portal/${student.id}/assessment`}
              className="shrink-0 rounded-xl bg-[#0D1B3D] px-6 py-3 text-center font-black text-white"
            >
              Take Assessment →
            </Link>
          </div>
        </section>
      ) : null}

      {access.session.role !== "STUDENT" ? (
        <section className="rounded-3xl border-2 border-[#4B2265]/20 bg-[#FAF7FC] p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
            PRIVATE STAFF SUPPORTS
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0D1B3D]">
                Accessibility & Learning Supports
              </h2>
              <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
                Manage approved 504, IEP, services-plan,
                deadline, timing, and response accommodations.
              </p>
            </div>
            <Link
              href={`/ambassador/student-portal/${student.id}/learning-supports`}
              className="shrink-0 rounded-xl bg-[#4B2265] px-5 py-3 text-sm font-black text-white"
            >
              MANAGE LEARNING SUPPORTS
            </Link>
          </div>
        </section>
      ) : null}

      {cohort ? (
        <StudentAccountabilityPanel
          studentId={student.id}
          cohortId={cohort.id}
          variant="dashboard"
        />
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          UP NEXT
        </p>

        {currentReleasedLesson && currentWeek !== null ? (
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[#725500]">
                Week {currentWeek} of {totalWeeks}
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                {currentReleasedLesson.title}
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Continue your Future Ready™ journey and build evidence for what comes next.
              </p>
            </div>

            <Link
              href={`/ambassador/student-portal/${student.id}/lesson/${currentWeek}`}
              className="shrink-0 rounded-xl bg-[#0D1B3D] px-7 py-4 text-center text-lg font-black text-white"
            >
              {programProgress.some(
                (progress) =>
                  progress.lesson.weekNumber === currentWeek &&
                  progress.percent > 0 &&
                  progress.percent < 100,
              )
                ? "Continue →"
                : "Open Lesson →"}
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-slate-50 p-6">
            <h2 className="text-2xl font-black text-[#0D1B3D]">
              You&apos;re caught up.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nothing new has been opened for you yet.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
          QUICK LINKS
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <QuickLink
            href={`/ambassador/student-portal/${student.id}/assignments`}
            title="Assignments"
            detail="Current work"
          />
          <QuickLink
            href={`/ambassador/student-portal/${student.id}/how-to-use-my-portal`}
            title="How to Use My Portal"
            detail="Start here · no guessing"
          />

          <QuickLink
            href={`/ambassador/student-portal/${student.id}/capstone`}
            title="Beyond the Game"
            detail="My Capstone · My Story"
          />

          <QuickLink
            href={`/ambassador/student-portal/${student.id}/profile`}
            title="Profile"
            detail="About me"
          />

          <QuickLink
            href="/ambassador/messages"
            title="Messages"
            detail="Program communication"
          />
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-[#0D1B3D]">{value}</p>

      <p className="mt-1 text-sm font-semibold text-slate-500">{detail}</p>
    </article>
  );
}

function QuickLink({
  href,
  title,
  detail,
}: {
  href: string;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#F2B705]"
    >
      <p className="font-black text-[#0D1B3D]">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </Link>
  );
}
