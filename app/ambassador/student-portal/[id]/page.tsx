import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import DayTwoExperience from "@/components/ambassador/day-two/DayTwoExperience";
import StudentWeekOneFrontDoor from "@/components/ambassador/delivery/StudentWeekOneFrontDoor";

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

  const programProgress = programId
    ? student.lessonProgress.filter(
        (progress) => progress.lesson.module.programId === programId,
      )
    : [];

  const completedLessons = programProgress.filter(
    (progress) => progress.completedAt !== null || progress.percent >= 100,
  ).length;

  const currentWeek =
    programProgress.length > 0
      ? Math.max(
          1,
          ...programProgress.map((progress) => progress.lesson.weekNumber),
        )
      : 1;

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
    <main className="space-y-8">
      <DayTwoExperience studentId={student.id} firstName={firstName} />

      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Student Experience
        </p>

        <h1 className="mt-3 text-4xl font-black">Welcome, {studentName}</h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Build your skills, capture your growth, complete your Future Ready™
          work, and prepare for what comes next.
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
              {program.totalWeeks}-Week Program
            </span>
          )}
        </div>
      </section>

      {currentWeek === 1 && (
        <StudentWeekOneFrontDoor
          studentId={student.id}
          assessmentComplete={Boolean(student.readinessProfile?.completedAt)}
        />
      )}

      {currentWeek === 1 && (
        <section className="rounded-3xl border-2 border-[#F2B705] bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                GRADUATION PROJECT
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                My Future Ready™ Story
              </h2>

              <p className="mt-2 text-lg font-bold text-[#4B2265]">
                Who am I beyond my role — and who am I becoming?
              </p>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Your Capstone grows from your reflections, experiences, skills,
                values, goals, and discoveries throughout Future Ready™. Every
                week, you will collect pieces of your story, experiences,
                skills, reflections, people, challenges, accomplishments, and
                future direction.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#FFF9DF] px-4 py-2 text-sm font-black text-[#725500]">
                  Chapter Zero · My Story Brain Map
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-[#0D1B3D]">
                  Evidence Saved · {portfolioArtifacts}
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-[#0D1B3D]">
                  Current Connection · Week 1
                </span>
              </div>
            </div>

            <Link
              href={`/ambassador/student-portal/${student.id}/capstone`}
              className="shrink-0 rounded-xl bg-[#0D1B3D] px-7 py-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-[#162A59]"
            >
              Open My Capstone →
            </Link>
          </div>
        </section>
      )}

      {!student.readinessProfile?.completedAt ? (
        <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-7 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
                Day 1 Baseline
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Start with your Future Ready™ Assessment
              </h2>

              <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-700">
                Before we measure growth, we need to know where you are
                starting. This is not a grade. Answer honestly and create your
                Day 1 baseline.
              </p>
            </div>

            <Link
              href={`/ambassador/student-portal/${student.id}/assessment`}
              className="shrink-0 rounded-xl bg-[#0D1B3D] px-7 py-4 text-center font-black text-white shadow-lg"
            >
              Take Day 1 Assessment →
            </Link>
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="font-black text-emerald-900">
            ✓ Day 1 Future Ready™ baseline complete
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-800">
            Your readiness score now reflects your real starting point.
          </p>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Week"
          value={String(currentWeek)}
          detail={totalWeeks ? `of ${totalWeeks} weeks` : "Program progress"}
        />

        <StatCard
          label="Program Progress"
          value={`${progressPercent}%`}
          detail={`${completedLessons} lessons complete`}
        />

        <StatCard
          label="Readiness"
          value={`${Math.round(Number(student.readinessScore))}%`}
          detail="Future Ready™ score"
        />

        <StatCard
          label="Portfolio"
          value={String(portfolioArtifacts)}
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
                Your current Future Ready™ lesson is ready. Open the lesson to
                complete your activity, reflection, and required work.
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
                  progress.percent < 100,
              )
                ? `Continue Week ${currentWeek} →`
                : `Start Week ${currentWeek} →`}
            </Link>
          </div>
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StudentActionCard
          title="My Growth"
          description="Your complete Future Ready™ record, progress, evidence, and achievements."
          href={`/ambassador/student-passport/${student.id}`}
          action="See My Progress"
        />

        <StudentActionCard
          title="My Profile"
          description="Build and hard-save your strengths, values, interests, goals, and future direction."
          href={`/ambassador/student-portal/${student.id}/profile`}
          action={student.profileComplete ? "View Profile" : "Build Profile"}
        />

        <StudentActionCard
          title="Build My Story"
          description="Your Future Ready™ graduation reflection book — who you are beyond your role, what has shaped you, and who you are becoming."
          href={`/ambassador/student-portal/${student.id}/capstone`}
          action="Continue My Story"
        />

        <StudentActionCard
          title="Digital Portfolio"
          description="Save projects, documents, presentations, certificates, and evidence of growth."
          href={`/ambassador/student-passport/${student.id}/portfolio`}
          action="Open Portfolio"
        />

        <StudentActionCard
          title="Explore What Fits Me"
          description="Explore career ideas connected to your strengths, interests, skills, and future goals — then save careers you want to investigate."
          href={`/ambassador/student-portal/${student.id}/career-pathways`}
          action="View Opportunities"
        />

        <StudentActionCard
          title="Month Ahead"
          description="See upcoming class topics, speakers, experiences, and important program dates."
          href="/ambassador/calendar"
          action="View Calendar"
        />

        <StudentActionCard
          title="Reflection Journal"
          description="Capture what you are learning and how you are growing throughout the program."
          href={`/ambassador/student-passport/${student.id}/reflections`}
          action="Open Journal"
        />

        <StudentActionCard
          title="Messages"
          description="Connect with your Future Ready™ facilitator and program team."
          href="/ambassador/messages"
          action="Open Messages"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            My Program
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            {program?.name ?? "Future Ready™"}
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
            <MiniStat label="Reflections" value={submittedReflections} />

            <MiniStat label="Artifacts" value={portfolioArtifacts} />

            <MiniStat
              label="Profile"
              value={student.profile ? "Saved" : "Start"}
            />

            <MiniStat label="Lessons" value={completedLessons} />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border-2 border-[#F2B705]/50 bg-[#FFF9DF] p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
          LIFE ACCOUNT · REAL MONEY SKILLS
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
          💰 My Future Ready™ Life Account
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-slate-700">
          Earn it. Spend it. Save it. Lose it. Give it. Borrow it. Build
          something with it.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/ambassador/student-portal/${student.id}/life-account`}
            className="rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
          >
            OPEN LIFE ACCOUNT →
          </Link>

          <Link
            href={`/ambassador/student-portal/${student.id}/life-account/friday`}
            className="rounded-xl bg-[#F2B705] px-6 py-3 font-black text-[#0D1B3D]"
          >
            FUTURE READY FRIDAY™
          </Link>
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

      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">{value}</p>

      <p className="mt-2 text-sm font-semibold text-slate-500">{detail}</p>
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
      <h2 className="text-xl font-black text-[#0D1B3D]">{title}</h2>

      <p className="mt-3 flex-1 leading-7 text-slate-600">{description}</p>

      <Link href={href} className="mt-6 inline-flex font-black text-[#0D1B3D]">
        {action} →
      </Link>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-black text-[#0D1B3D]">{value}</p>
    </div>
  );
}
