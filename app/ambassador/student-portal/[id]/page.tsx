import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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

  const access =
    await authorizeStudentAccess(id);

  if (!access.allowed) {
    if (access.status === 401) {
      redirect("/ambassador/login");
    }

    if (access.status === 404) {
      notFound();
    }

    redirect("/student-portal");
  }

  const student =
    await prisma.student.findUnique({
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
      },
    });

  if (!student) {
    notFound();
  }

  const enrollment =
    student.enrollments[0];

  const cohort =
    enrollment?.cohort ?? null;

  const program =
    cohort?.program ?? null;

  const programId =
    program?.id ?? null;

  const programProgress =
    programId
      ? student.lessonProgress.filter(
          (progress) =>
            progress.lesson.module
              .programId === programId
        )
      : [];

  const completedLessons =
    programProgress.filter(
      (progress) =>
        progress.completedAt !== null ||
        progress.percent >= 100
    ).length;

  const currentWeek =
    programProgress.length > 0
      ? Math.max(
          1,
          ...programProgress.map(
            (progress) =>
              progress.lesson.weekNumber
          )
        )
      : 1;

  const totalWeeks =
    program?.totalWeeks ?? 0;

  const progressPercent =
    totalWeeks > 0
      ? Math.min(
          100,
          Math.round(
            (completedLessons /
              totalWeeks) *
              100
          )
        )
      : 0;

  const portfolioArtifacts =
    student.portfolio?.artifacts
      .length ?? 0;

  const submittedReflections =
    student.reflections.filter(
      (reflection) =>
        reflection.status ===
        "SUBMITTED"
    ).length;

  const studentName =
    student.user.displayName ??
    `${student.user.firstName} ${student.user.lastName}`.trim();

  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Student Experience
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Welcome, {studentName}
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Build your skills, capture your
          growth, complete your Future
          Ready™ work, and prepare for
          what comes next.
        </p>

        <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold">
          {student.school?.name && (
            <span className="rounded-full bg-white/10 px-4 py-2">
              {student.school.name}
            </span>
          )}

          {cohort?.name && (
            <span className="rounded-full bg-white/10 px-4 py-2">
              {cohort.name}
            </span>
          )}

          {program && (
            <span className="rounded-full bg-[#F2B705] px-4 py-2 text-[#0D1B3D]">
              {program.totalWeeks}-Week
              Program
            </span>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Week"
          value={String(currentWeek)}
          detail={
            totalWeeks
              ? `of ${totalWeeks} weeks`
              : "Program progress"
          }
        />

        <StatCard
          label="Program Progress"
          value={`${progressPercent}%`}
          detail={`${completedLessons} lessons complete`}
        />

        <StatCard
          label="Readiness"
          value={`${Math.round(
            Number(
              student.readinessScore
            )
          )}%`}
          detail="Future Ready™ score"
        />

        <StatCard
          label="Portfolio"
          value={String(
            portfolioArtifacts
          )}
          detail="saved artifacts"
        />
      </section>

      {program && (
        <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-7 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                Current Lesson
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Week {currentWeek}: Ready to Learn
              </h2>

              <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
                Your current Future Ready™ lesson is ready.
                Open the lesson to complete your activity,
                reflection, and required work.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
                  Week {currentWeek} of {totalWeeks}
                </span>

                <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
                  {completedLessons} lessons complete
                </span>
              </div>
            </div>

            <Link
              href={`/ambassador/student-portal/${student.id}/lesson/${currentWeek}`}
              className="shrink-0 rounded-xl bg-[#0D1B3D] px-7 py-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-[#162A59]"
            >
              {programProgress.some(
                (progress) =>
                  progress.lesson.weekNumber === currentWeek &&
                  progress.percent > 0 &&
                  progress.percent < 100
              )
                ? `Continue Week ${currentWeek} →`
                : `Start Week ${currentWeek} →`}
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StudentActionCard
          title="My Passport"
          description="Your complete Future Ready™ record, progress, evidence, and achievements."
          href={`/ambassador/student-passport/${student.id}`}
          action="Open Passport"
        />

        <StudentActionCard
          title="My Profile"
          description="Build and hard-save your strengths, values, interests, goals, and future direction."
          href={`/ambassador/student-portal/${student.id}/profile`}
          action={
            student.profileComplete
              ? "View Profile"
              : "Build Profile"
          }
        />

        <StudentActionCard
          title="Digital Portfolio"
          description="Save projects, documents, presentations, certificates, and evidence of growth."
          href={`/ambassador/student-passport/${student.id}/portfolio`}
          action="Open Portfolio"
        />

        <StudentActionCard
          title="Career Exploration"
          description="Explore career ideas connected to your strengths, interests, skills, and future goals — then save careers you want to investigate."
          href={`/ambassador/student-portal/${student.id}/career-pathways`}
          action="Explore Careers"
        />


        <StudentActionCard
          title="Reflection Journal"
          description="Capture what you are learning and how you are growing throughout the program."
          href={`/ambassador/student-passport/${student.id}/reflections`}
          action="Open Journal"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            My Program
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            {program?.name ??
              "Future Ready™"}
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            {totalWeeks > 0
              ? `You are enrolled in the ${totalWeeks}-week Future Ready™ experience.`
              : "Your active Future Ready™ program will appear here."}
          </p>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[#F2B705]"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            My Evidence
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Building My Future
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <MiniStat
              label="Reflections"
              value={submittedReflections}
            />

            <MiniStat
              label="Artifacts"
              value={portfolioArtifacts}
            />

            <MiniStat
              label="Profile"
              value={
                student.profile
                  ? "Saved"
                  : "Start"
              }
            />

            <MiniStat
              label="Lessons"
              value={completedLessons}
            />
          </div>
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
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function StudentActionCard({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-[#0D1B3D]">
        {title}
      </h2>

      <p className="mt-3 flex-1 leading-7 text-slate-600">
        {description}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex font-black text-[#0D1B3D]"
      >
        {action} →
      </Link>
    </article>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#0D1B3D]">
        {value}
      </p>
    </div>
  );
}
