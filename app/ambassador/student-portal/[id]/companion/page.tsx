import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import Build6PushNotifications from "@/components/student/Build6PushNotifications";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function cleanSignal(value?: string | null) {
  if (!value?.trim()) return "";

  return (
    value
      .split(/[\n,;|]+/)
      .map((item) => item.trim())
      .filter(Boolean)[0] ?? ""
  );
}

function formatDate(value?: Date | null) {
  if (!value) return "Date coming soon";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(value);
}

function formatToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  }).format(new Date());
}

function dailyFocus({
  firstName,
  strength,
  value,
  skill,
}: {
  firstName: string;
  strength: string;
  value: string;
  skill: string;
}) {
  if (strength && value) {
    return `${firstName}, use your ${strength} today in a way that reflects ${value}. Notice one moment worth remembering — that moment may become part of your story.`;
  }

  if (strength) {
    return `${firstName}, put your ${strength} to work today. Pay attention to where it helps you lead, communicate, solve a problem, or support someone else.`;
  }

  if (value) {
    return `${firstName}, let ${value} guide one decision today. What you repeatedly choose is part of who you are becoming.`;
  }

  if (skill) {
    return `${firstName}, look for one real opportunity to practice ${skill} today. Small repetitions become evidence of growth.`;
  }

  return `${firstName}, pay attention today. What challenged you, what energized you, who influenced you, and what did you learn about yourself? Keep what matters.`;
}

function ActionCard({
  href,
  eyebrow,
  title,
  description,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#F2B705] hover:shadow-md"
    >
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4B2265]">
        {eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-black text-[#0D1B3D]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-4 text-sm font-black text-[#4B2265]">OPEN →</p>
    </Link>
  );
}

export default async function Build6StudentCompanionPage({
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

    redirect("/ambassador");
  }

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      userId: true,
      readinessScore: true,
      profileComplete: true,
      careerSummary: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          displayName: true,
        },
      },
      profile: {
        select: {
          aboutMe: true,
          strengths: true,
          values: true,
          careerInterests: true,
          futureGoals: true,
          skillsToBuild: true,
        },
      },
      readinessProfile: {
        select: {
          completedAt: true,
        },
      },
      studentSkills: {
        select: {
          skill: {
            select: {
              name: true,
            },
          },
        },
        take: 6,
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
      reflections: {
        select: {
          id: true,
          status: true,
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
              module: {
                select: {
                  programId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  const enrollment = student.enrollments[0] ?? null;
  const cohort = enrollment?.cohort ?? null;
  const program = cohort?.program ?? null;

  const releasedLessons =
    cohort && program
      ? await prisma.lesson.findMany({
          where: {
            status: "ACTIVE",
            module: {
              programId: program.id,
            },
            deliverySettings: {
              some: {
                cohortId: cohort.id,
                releasedToStudents: true,
              },
            },
          },
          select: {
            id: true,
            weekNumber: true,
            title: true,
            module: {
              select: {
                phase: true,
              },
            },
          },
          orderBy: {
            weekNumber: "asc",
          },
        })
      : [];

  const programProgress = program
    ? student.lessonProgress.filter(
        (progress) => progress.lesson.module.programId === program.id,
      )
    : [];

  const completedLessons = releasedLessons.filter((lesson) => {
    const progress = programProgress.find(
      (item) => item.lessonId === lesson.id,
    );

    return Boolean(
      progress &&
        (progress.completedAt !== null || progress.percent >= 100),
    );
  }).length;

  const currentLesson =
    releasedLessons.find((lesson) => {
      const progress = programProgress.find(
        (item) => item.lessonId === lesson.id,
      );

      return (
        !progress ||
        (progress.completedAt === null && progress.percent < 100)
      );
    }) ??
    releasedLessons[releasedLessons.length - 1] ??
    null;

  const releasedLessonIds = releasedLessons.map((lesson) => lesson.id);

  const assignments =
    cohort && releasedLessonIds.length
      ? await prisma.assignment.findMany({
          where: {
            status: "ACTIVE",
            lessonId: {
              in: releasedLessonIds,
            },
            OR: [
              {
                cohortId: cohort.id,
              },
              {
                cohortId: null,
              },
            ],
          },
          select: {
            id: true,
            lessonId: true,
            title: true,
            dueAt: true,
            submissions: {
              where: {
                studentId: student.id,
              },
              select: {
                status: true,
                submittedAt: true,
              },
              take: 1,
            },
          },
          orderBy: [
            {
              dueAt: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
          take: 10,
        })
      : [];

  const incompleteAssignments = assignments.filter((assignment) => {
    const status = assignment.submissions[0]?.status;

    return status !== "SUBMITTED" && status !== "APPROVED";
  });

  const nextAssignment = incompleteAssignments[0] ?? null;

  const upcomingExperiences = cohort
    ? await prisma.cohortExperience.findMany({
        where: {
          cohortId: cohort.id,
          visibleToStudent: true,
          eventDate: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        select: {
          id: true,
          weekNumber: true,
          experienceType: true,
          title: true,
          eventDate: true,
          startTime: true,
          endTime: true,
          siteName: true,
          requiredAttire: true,
          studentVisibleNotes: true,
        },
        orderBy: {
          eventDate: "asc",
        },
        take: 3,
      })
    : [];

  const unreadNotifications = await prisma.notification.count({
    where: {
      userId: student.userId,
      readAt: null,
    },
  });

  const latestDailyFocus = await prisma.notification.findFirst({
    where: {
      userId: student.userId,
      type: {
        startsWith: "BUILD6_DAILY_FOCUS:",
      },
    },
    select: {
      title: true,
      message: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const firstName =
    student.user.firstName ||
    student.user.displayName?.split(" ")[0] ||
    "Student";

  const strength = cleanSignal(student.profile?.strengths);
  const value = cleanSignal(student.profile?.values);
  const skill =
    cleanSignal(student.profile?.skillsToBuild) ||
    student.studentSkills[0]?.skill.name ||
    "";

  const identityFieldCount = [
    student.profile?.aboutMe,
    student.profile?.strengths,
    student.profile?.values,
    student.profile?.careerInterests,
    student.profile?.skillsToBuild,
    student.profile?.futureGoals,
  ].filter((value) => Boolean(value?.trim())).length;

  const stage =
    currentLesson?.module.phase?.replaceAll("_", " ").toUpperCase() ||
    "BUILD WHAT'S NEXT";

  const progressPercent =
    releasedLessons.length > 0
      ? Math.min(
          100,
          Math.round(
            (completedLessons / releasedLessons.length) * 100,
          ),
        )
      : 0;

  const evidenceCount = student.portfolio?.artifacts.length ?? 0;

  const reflectionCount = student.reflections.filter(
    (reflection) =>
      reflection.status === "SUBMITTED" ||
      reflection.status === "APPROVED",
  ).length;

  const nextLessonHref = currentLesson
    ? `/ambassador/student-portal/${student.id}/lesson/${currentLesson.weekNumber}`
    : `/ambassador/student-portal/${student.id}`;

  return (
    <main className="space-y-6 pb-24">
      <section className="overflow-hidden rounded-[30px] bg-[#0D1B3D] text-white shadow-lg">
        <div className="p-7 md:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F2B705]">
                BUILD6™ STUDENT COMPANION
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-5xl">
                Hi, {firstName}.
              </h1>

              <p className="mt-3 text-sm font-bold text-slate-300">
                {formatToday()}
              </p>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">
                One place to see what matters now, keep your thoughts,
                prepare for real experiences, and build the story of who
                you are becoming.
              </p>
            </div>

            <div className="min-w-[210px] rounded-2xl border border-white/15 bg-white/10 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#F2B705]">
                MY BUILD6 STAGE
              </p>
              <p className="mt-2 text-xl font-black">{stage}</p>
              <p className="mt-2 text-sm text-slate-300">
                {currentLesson
                  ? `Week ${currentLesson.weekNumber} · ${currentLesson.title}`
                  : "Your next released experience will appear here."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid border-t border-white/10 sm:grid-cols-4">
          <div className="border-white/10 p-5 sm:border-r">
            <p className="text-xs font-bold text-slate-400">Released progress</p>
            <p className="mt-1 text-2xl font-black">{progressPercent}%</p>
          </div>

          <div className="border-white/10 p-5 sm:border-r">
            <p className="text-xs font-bold text-slate-400">Open work</p>
            <p className="mt-1 text-2xl font-black">
              {incompleteAssignments.length}
            </p>
          </div>

          <div className="border-white/10 p-5 sm:border-r">
            <p className="text-xs font-bold text-slate-400">Story evidence</p>
            <p className="mt-1 text-2xl font-black">{evidenceCount}</p>
          </div>

          <div className="p-5">
            <p className="text-xs font-bold text-slate-400">Alerts</p>
            <p className="mt-1 text-2xl font-black">{unreadNotifications}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#4B2265]/20 bg-white p-6 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              10:00 AM BUILD6 MESSAGE
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              {latestDailyFocus?.title || "Your daily BUILD6 focus will appear here."}
            </h2>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              {latestDailyFocus?.message ||
                "BUILD6 will use only your own profile, goals, skills and upcoming program experiences to create a short daily focus. It will not invent facts about you."}
            </p>
          </div>

          <div className="shrink-0 rounded-xl bg-[#F3ECF7] px-4 py-3 text-xs font-black text-[#4B2265]">
            10:00 AM · NEW YORK TIME
          </div>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Why this message? It is based on information you have already added to BUILD6 and scheduled experiences in your active cohort.
        </p>
      </section>

      <Build6PushNotifications studentId={student.id} />

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/ambassador/student-portal/${student.id}/companion/identity`}
          className="rounded-3xl border-2 border-[#4B2265]/30 bg-[#F8F3FA] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#4B2265] hover:shadow-md"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            WHO I AM
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            BUILD6™ Identity Map
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            See my strengths, values, interests, skills, goals, and the words I
            have already used to describe who I am.
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#4B2265]">
              {identityFieldCount}/6 areas mapped
            </span>
            <span className="text-sm font-black text-[#4B2265]">OPEN →</span>
          </div>
        </Link>

        <Link
          href={`/ambassador/student-portal/${student.id}/capstone`}
          className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            MY STORY · MY CAPSTONE
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Who Am I Becoming?
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Connect my identity, reflections, experiences, skills, evidence,
            challenges, relationships, and goals into the story I am building.
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#725500]">
              {reflectionCount} reflections · {evidenceCount} evidence
            </span>
            <span className="text-sm font-black text-[#0D1B3D]">OPEN →</span>
          </div>
        </Link>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6 shadow-sm md:p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            TODAY'S BUILD6 FOCUS
          </p>

          <p className="mt-4 text-xl font-black leading-8 text-[#0D1B3D]">
            {dailyFocus({
              firstName,
              strength,
              value,
              skill,
            })}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/ambassador/student-portal/${student.id}/companion/journal`}
              className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
            >
              CAPTURE WHAT I NOTICED →
            </Link>

            <Link
              href={`/ambassador/student-portal/${student.id}/companion/identity`}
              className="rounded-xl border border-[#0D1B3D] bg-white px-5 py-3 text-sm font-black text-[#0D1B3D]"
            >
              MY BUILD6 IDENTITY MAP
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            MY NEXT MOVE
          </p>

          {nextAssignment ? (
            <>
              <h2 className="mt-3 text-2xl font-black text-[#0D1B3D]">
                {nextAssignment.title}
              </h2>

              <p className="mt-2 text-sm font-bold text-slate-500">
                {nextAssignment.dueAt
                  ? `Due ${formatDate(nextAssignment.dueAt)}`
                  : "No due date posted"}
              </p>

              <Link
                href={`/ambassador/student-portal/${student.id}/assignments`}
                className="mt-5 inline-block rounded-xl bg-[#F2B705] px-5 py-3 text-sm font-black text-[#0D1B3D]"
              >
                OPEN MY WORK →
              </Link>
            </>
          ) : currentLesson ? (
            <>
              <h2 className="mt-3 text-2xl font-black text-[#0D1B3D]">
                Continue Week {currentLesson.weekNumber}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {currentLesson.title}
              </p>

              <Link
                href={nextLessonHref}
                className="mt-5 inline-block rounded-xl bg-[#F2B705] px-5 py-3 text-sm font-black text-[#0D1B3D]"
              >
                CONTINUE →
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-2xl font-black text-[#0D1B3D]">
                You're caught up.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your next released lesson or assignment will appear here.
              </p>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            COMING UP
          </p>
          <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
            Speakers, Visits & Real-World Experiences
          </h2>
        </div>

        {upcomingExperiences.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingExperiences.map((experience) => (
              <article
                key={experience.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
                  {experience.experienceType.replaceAll("_", " ")}
                </p>

                <h3 className="mt-2 text-lg font-black text-[#0D1B3D]">
                  {experience.title}
                </h3>

                <p className="mt-3 text-sm font-bold text-slate-600">
                  {formatDate(experience.eventDate)}
                </p>

                {(experience.startTime || experience.endTime) && (
                  <p className="mt-1 text-sm text-slate-500">
                    {[experience.startTime, experience.endTime]
                      .filter(Boolean)
                      .join(" – ")}
                  </p>
                )}

                {experience.siteName && (
                  <p className="mt-2 text-sm text-slate-600">
                    {experience.siteName}
                  </p>
                )}

                {experience.requiredAttire && (
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700">
                    Be ready: {experience.requiredAttire}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="font-bold text-slate-600">
              Your next speaker, tour, or experience will appear here when it is posted.
            </p>
          </div>
        )}
      </section>

      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          MY COMPANION
        </p>

        <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
          Everything I Need
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ActionCard
            href={nextLessonHref}
            eyebrow="RIGHT NOW"
            title={
              currentLesson
                ? `Week ${currentLesson.weekNumber}`
                : "My Program"
            }
            description="Open the work and experience that is active for me now."
          />

          <ActionCard
            href={`/ambassador/student-portal/${student.id}/assignments`}
            eyebrow="MY WORK"
            title="Assignments"
            description={`${incompleteAssignments.length} item${
              incompleteAssignments.length === 1 ? "" : "s"
            } still open.`}
          />

          <ActionCard
            href={`/ambassador/student-portal/${student.id}/companion/identity`}
            eyebrow="WHO I AM"
            title="BUILD6 Identity Map"
            description={
              student.profileComplete
                ? "See the strengths, values, interests, skills and goals already shaping my story."
                : "Build the identity map that helps me understand and tell my story."
            }
          />

          <ActionCard
            href={`/ambassador/student-portal/${student.id}/companion/journal`}
            eyebrow="QUICK CAPTURE"
            title="Daily Journal"
            description="Capture a thought, lesson, conversation, challenge, win, or moment before I forget it."
          />

          <ActionCard
            href={`/ambassador/student-portal/${student.id}/capstone`}
            eyebrow="MY STORY · MY CAPSTONE"
            title="My Capstone"
            description={`${reflectionCount} saved reflection${
              reflectionCount === 1 ? "" : "s"
            } are already helping build my story.`}
          />

          <ActionCard
            href="/ambassador/calendar"
            eyebrow="WHAT'S NEXT"
            title="Calendar"
            description="See classes, speakers, deadlines, tours and field experiences."
          />

          <ActionCard
            href="/ambassador/messages"
            eyebrow="STAY CONNECTED"
            title="Messages"
            description="Use the private BUILD6 communication system for approved program communication."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
            STRENGTH
          </p>
          <p className="mt-2 font-black text-[#0D1B3D]">
            {strength || "Add this to My Profile"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
            VALUE
          </p>
          <p className="mt-2 font-black text-[#0D1B3D]">
            {value || "Add this to My Profile"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
            SKILL I'M BUILDING
          </p>
          <p className="mt-2 font-black text-[#0D1B3D]">
            {skill || "Choose my next skill"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-[#0D1B3D] px-6 py-5 text-center text-sm text-slate-300">
        <p className="font-black text-white">
          BUILD6™ · BUILD WHAT'S NEXT.
        </p>
        <p className="mt-2">
          © 2026 LINK Lake Norman, LLC · Proprietary program experience.
        </p>
      </section>
    </main>
  );
}
