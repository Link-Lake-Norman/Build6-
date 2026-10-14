import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import LessonCompletion from "@/app/ambassador/curriculum/[week]/LessonCompletion";
import StudentAppliedLearningLab from "@/components/student/StudentAppliedLearningLab";
import type { StudentAppliedLearningAsset } from "@/components/student/StudentAppliedLearningLab";
import { getAppliedLearningForWeek } from "@/content/applied-learning";
import StudentWeeklyWorkspace from "@/components/student/StudentWeeklyWorkspace";
import { getStudentWeeklyWorkspace } from "@/content/ambassador/student-weekly-workspaces";

type PageProps = {
  params: Promise<{
    id: string;
    week: string;
  }>;
};

type LessonContent = {
  week?: number;
  focus?: string;
  title?: string;
  program?: string;
  activity?: string;
  reflection?: string;
};

export default async function StudentLessonPage({ params }: PageProps) {
  const { id, week } = await params;

  const weekNumber = Number(week);

  if (!Number.isInteger(weekNumber) || weekNumber < 1) {
    notFound();
  }

  /* BUILD6_AUTOMATIC_WEEK_WORKBOOK_V1 */
  const workbookWeekCode = `week-${String(weekNumber).padStart(2, "0")}`;
  const workbookFileName =
    `Future-Ready-Week-${String(weekNumber).padStart(2, "0")}-Student-Workbook.pdf`;
  const workbookHref =
    `/api/ambassador/download/${workbookWeekCode}/${encodeURIComponent(workbookFileName)}`;


  const access = await authorizeStudentAccess(id);

  if (!access.allowed) {
    if (access.status === 401) {
      redirect("/ambassador/login");
    }

    if (access.status === 404) {
      notFound();
    }

    redirect("/ambassador");
  }

  const student = await prisma.student.findUnique({
    where: {
      id,
    },

    select: {
      id: true,

      user: {
        select: {
          firstName: true,
          lastName: true,
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

                  modules: {
                    select: {
                      lessons: {
                        where: {
                          weekNumber,
                          status: "ACTIVE",
                        },

                        select: {
                          id: true,
                          title: true,
                          summary: true,
                          content: true,
                          weekNumber: true,
                          estimatedMinutes: true,

                          deliverySettings: {
                            where: {
                              cohortId: access.cohortIds[0],
                              releasedToStudents: true,
                            },

                            select: {
                              releasedToStudents: true,
                              activity: true,
                              assessment: true,
                              homework: true,
                              workbook: true,
                              badgeEnabled: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        take: 1,
      },
    },
  });

  if (!student) {
    notFound();
  }

  const enrollment = student.enrollments[0];

  if (!enrollment) {
    notFound();
  }

  const program = enrollment.cohort.program;

  if (weekNumber > program.totalWeeks) {
    notFound();
  }

  const lesson = program.modules
    .flatMap((module) => module.lessons)
    .find(
      (item) =>
        item.weekNumber === weekNumber &&
        item.deliverySettings.some((setting) => setting.releasedToStudents),
    );

  if (!lesson) {
    return (
      <main className="space-y-8">
        <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F2B705]">
            BUILD6™ Student Experience
          </p>

          <h1 className="mt-3 text-4xl font-black">Week {weekNumber}</h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">
            This lesson has not been released yet.
          </p>
        </section>

        <Link
          href={`/ambassador/student-portal/${id}`}
          className="inline-block rounded-xl bg-[#0D1B3D] px-6 py-3 font-black text-white"
        >
          ← Return to My Dashboard
        </Link>
      </main>
    );
  }

  const content =
    lesson.content &&
    typeof lesson.content === "object" &&
    !Array.isArray(lesson.content)
      ? (lesson.content as LessonContent)
      : {};

  const delivery = lesson.deliverySettings[0];

  const activity =
    content.activity ||
    "Complete the student activity provided by your facilitator.";

  const reflection =
    content.reflection ||
    "What did you learn about yourself during this lesson?";

  const focus = content.focus || lesson.summary || "";

  const badgeEarned = delivery?.badgeEnabled
    ? `Week ${weekNumber} BUILD6™ Milestone`
    : "Lesson Completion";

  const portfolioEvidence =
    content.activity || `Week ${weekNumber} learning evidence`;

  /*
   * STUDENT-SAFE APPLIED LEARNING DATA
   *
   * Important:
   * Facilitator answer guides, reasoning,
   * coaching points and consequence reveals
   * are intentionally NOT passed to the
   * client-side student component.
   */
  const studentAppliedLearningAssets: StudentAppliedLearningAsset[] =
    getAppliedLearningForWeek(weekNumber).map((asset) => ({
      id: asset.id,
      title: asset.title,
      format: asset.format,
      audience: asset.audience,
      skills: asset.skills,
      whyItMatters: asset.whyItMatters,
      scenario: asset.scenario,
      studentChallenge: asset.studentChallenge,

      roles: asset.roles?.map((role) => ({
        role: role.role,
        responsibility: role.responsibility,
      })),

      professionalLanguage: asset.professionalLanguage?.map((language) => ({
        situation: language.situation,
        insteadOf: language.insteadOf,
        tryThis: language.tryThis,
      })),

      curveballs: asset.curveballs ? [...asset.curveballs] : undefined,

      retryPrompt: asset.retryPrompt,

      discussionQuestions: [...asset.discussionQuestions],

      reflectionPrompts: [...asset.reflectionPrompts],

      portfolioEvidence: asset.portfolioEvidence,

      athleteExtension: asset.athleteExtension
        ? {
            title: asset.athleteExtension.title,
            scenario: asset.athleteExtension.scenario,
            considerations: [...asset.athleteExtension.considerations],
          }
        : undefined,
    }));

  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F2B705]">
          BUILD6™ Student Experience
        </p>

        <p className="mt-5 font-bold text-slate-300">
          {enrollment.cohort.name}
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Week {lesson.weekNumber}: {lesson.title}
        </h1>

        {focus ? (
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            {focus}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            {lesson.estimatedMinutes} minutes
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Week {lesson.weekNumber} of {program.totalWeeks}
          </span>
        </div>
      </section>

              {weekNumber !== 15 ? (
          <section className="rounded-2xl border-2 border-[#F2B705] bg-[#FFF9DF] p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">TODAY'S WORKBOOK</p>
            <h2 className="mt-1 text-xl font-black text-[#0D1B3D]">Week {weekNumber} Student Workbook</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Use this workbook for every class day this week. Complete the section for today's Day 1–5 assignment, then submit the required evidence. These pages build your reflections, Passport evidence, and Capstone.
            </p>
            <a href={workbookHref} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-[#0D1B3D] px-4 py-2.5 text-sm font-black text-white">
              Open Week {weekNumber} Workbook →
            </a>
          </section>
        ) : null}

<section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#725500]">
            My Activity
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            What I'm Doing
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-700">{activity}</p>

          {delivery?.activity === "REQUIRED" ? (
            <div className="mt-6 inline-flex rounded-full bg-[#FFF3C4] px-4 py-2 text-sm font-black text-[#0D1B3D]">
              Required
            </div>
          ) : null}
        </article>

        <StudentWeeklyWorkspace
          studentId={student.id}
          lessonId={lesson.id}
          weekNumber={lesson.weekNumber}
          lessonTitle={lesson.title}
          reflectionPrompt={reflection}
          passportHref={`/ambassador/student-passport/${id}`}
          workspace={getStudentWeeklyWorkspace(lesson.weekNumber)}
        />
      </section>

      <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#725500]">
          My Evidence
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Build My BUILD6™ Record
        </h2>

        <p className="mt-4 text-lg leading-8 text-slate-700">
          Save evidence from this week's work in your Digital Portfolio.
        </p>

        <Link
          href={`/ambassador/student-passport/${id}/portfolio`}
          className="mt-6 inline-block rounded-xl border border-[#0D1B3D] px-5 py-3 font-black text-[#0D1B3D]"
        >
          Open Digital Portfolio →
        </Link>
      </article>

      {studentAppliedLearningAssets.length > 0 ? (
        <StudentAppliedLearningLab
          week={lesson.weekNumber}
          studentId={student.id}
          assets={studentAppliedLearningAssets}
        />
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/ambassador/student-portal/${student.id}/assignments`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
            ASSIGNMENTS
          </p>

          <h2 className="mt-2 text-xl font-black text-[#0D1B3D]">
            Finish My Work →
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Complete the work your facilitator assigned for this lesson.
          </p>
        </Link>

        <Link
          href={`/ambassador/student-portal/${student.id}/capstone`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
            CAPSTONE
          </p>

          <h2 className="mt-2 text-xl font-black text-[#0D1B3D]">
            Continue My Story →
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep what this experience helped you learn about yourself.
          </p>
        </Link>
      </section>

      <LessonCompletion
        week={lesson.weekNumber}
        title={lesson.title}
        badgeEarned={badgeEarned}
        portfolioEvidence={portfolioEvidence}
      />

      <nav className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-7">
        <Link
          href={`/ambassador/student-portal/${id}`}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700"
        >
          ← My Dashboard
        </Link>

        <Link
          href={`/ambassador/student-passport/${id}`}
          className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
        >
          My Passport →
        </Link>
      </nav>
    </main>
  );
}
