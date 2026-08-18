import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type CompetencyItem = {
  name: string;
  score: number;
};

export default async function StudentPassportPage({ params }: PageProps) {
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

  const isStudentView = access.session.role === "STUDENT";

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
      careerSummary: true,

      user: {
        select: {
          firstName: true,
          lastName: true,
          displayName: true,
          email: true,
          status: true,
        },
      },

      school: {
        select: {
          name: true,
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

      enrollments: {
        where: {
          status: "ACTIVE",
        },

        select: {
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

                  modules: {
                    select: {
                      lessons: {
                        where: {
                          status: "ACTIVE",
                        },

                        select: {
                          id: true,
                          title: true,
                          weekNumber: true,
                          summary: true,

                          deliverySettings: {
                            select: {
                              cohortId: true,
                              releasedToStudents: true,
                            },
                          },
                        },

                        orderBy: {
                          weekNumber: "asc",
                        },
                      },
                    },

                    orderBy: {
                      position: "asc",
                    },
                  },
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
          startedAt: true,
          completedAt: true,
        },
      },

      attendance: {
        select: {
          id: true,
          cohortId: true,
          status: true,
          date: true,
        },

        orderBy: {
          date: "desc",
        },
      },

      badgeAwards: {
        select: {
          id: true,
          awardedAt: true,

          badge: {
            select: {
              id: true,
              name: true,
              description: true,
              programId: true,
            },
          },
        },

        orderBy: {
          awardedAt: "desc",
        },
      },

      studentSkills: {
        select: {
          id: true,
          level: true,
          score: true,
          verifiedAt: true,

          skill: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },

        orderBy: {
          updatedAt: "desc",
        },
      },

      careerInterests: {
        select: {
          id: true,
          careerName: true,
          industry: true,
          interest: true,
          notes: true,
        },

        orderBy: {
          interest: "desc",
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

      reflections: {
        select: {
          id: true,
          lessonId: true,
          status: true,
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

  const totalWeeks = program?.totalWeeks ?? 0;

  const programId = program?.id ?? null;

  const cohortId = cohort?.id ?? null;

  /*
   * Flatten only lessons belonging to the
   * student's actual enrolled program.
   */
  const programLessons =
    program?.modules.flatMap((module) => module.lessons) ?? [];

  /*
   * Student sees only lessons that have been
   * explicitly released to this cohort.
   */
  const releasedLessons = cohortId
    ? programLessons.filter((lesson) =>
        lesson.deliverySettings.some(
          (setting) =>
            setting.cohortId === cohortId && setting.releasedToStudents,
        ),
      )
    : [];

  const progressByLesson = new Map(
    student.lessonProgress.map((progress) => [progress.lessonId, progress]),
  );

  const completedLessons = programLessons.filter((lesson) => {
    const progress = progressByLesson.get(lesson.id);

    return (
      (progress?.completedAt !== null && progress?.completedAt !== undefined) ||
      (progress?.percent ?? 0) >= 100
    );
  });

  const startedLessons = programLessons.filter((lesson) => {
    const progress = progressByLesson.get(lesson.id);

    return Boolean(progress?.startedAt) || (progress?.percent ?? 0) > 0;
  });

  /*
   * Current week:
   * 1. first released incomplete lesson
   * 2. latest started week
   * 3. week 1
   */
  const nextIncomplete = releasedLessons.find((lesson) => {
    const progress = progressByLesson.get(lesson.id);

    return !(progress?.completedAt || (progress?.percent ?? 0) >= 100);
  });

  const latestStartedWeek =
    startedLessons.length > 0
      ? Math.max(...startedLessons.map((lesson) => lesson.weekNumber))
      : 1;

  const currentWeek = nextIncomplete?.weekNumber ?? latestStartedWeek ?? 1;

  const currentLesson =
    releasedLessons.find((lesson) => lesson.weekNumber === currentWeek) ?? null;

  const progressPercent =
    totalWeeks > 0
      ? Math.min(100, Math.round((completedLessons.length / totalWeeks) * 100))
      : 0;

  const programAttendance = cohortId
    ? student.attendance.filter((record) => record.cohortId === cohortId)
    : [];

  const attendanceCount = programAttendance.length;

  const programBadges = programId
    ? student.badgeAwards.filter(
        (award) =>
          award.badge.programId === programId || award.badge.programId === null,
      )
    : student.badgeAwards;

  const portfolioArtifacts = student.portfolio?.artifacts ?? [];

  const approvedArtifacts = portfolioArtifacts.filter(
    (artifact) => artifact.approval === "APPROVED",
  ).length;

  const submittedReflections = student.reflections.filter(
    (reflection) => reflection.status === "SUBMITTED",
  ).length;

  const studentName =
    student.user.displayName ??
    `${student.user.firstName} ${student.user.lastName}`.trim();

  const initials = studentName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const competencies: CompetencyItem[] = student.readinessProfile
    ? [
        {
          name: "Self Awareness",
          score: Number(student.readinessProfile.selfAwareness),
        },
        {
          name: "Communication",
          score: Number(student.readinessProfile.communication),
        },
        {
          name: "Leadership",
          score: Number(student.readinessProfile.leadership),
        },
        {
          name: "Professional Presence",
          score: Number(student.readinessProfile.professionalPresence),
        },
        {
          name: "Career Readiness",
          score: Number(student.readinessProfile.careerReadiness),
        },
        {
          name: "Adaptability",
          score: Number(student.readinessProfile.adaptability),
        },
        {
          name: "AI Readiness",
          score: Number(student.readinessProfile.aiReadiness),
        },
      ]
    : student.studentSkills.map((studentSkill) => ({
        name: studentSkill.skill.name,
        score: Number(studentSkill.score),
      }));

  const careerInterestNames =
    student.careerInterests.length > 0
      ? student.careerInterests.map((interest) => interest.careerName)
      : (student.profile?.careerInterests ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[32px] bg-[#0D1B3D] text-white shadow-xl">
        <div className="grid gap-8 p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:p-10">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#F2B705] text-4xl font-black text-[#0D1B3D]">
            {initials}
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
              Future Ready™ Student Passport
            </p>

            <h1 className="mt-3 text-4xl font-black">{studentName}</h1>

            <p className="mt-3 text-lg text-slate-200">
              {student.school?.name ?? "Future Ready™"}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {student.gradeLevel && <PassportTag label={student.gradeLevel} />}

              {cohort?.name && <PassportTag label={cohort.name} />}

              <PassportTag label={`Week ${currentWeek}`} />

              {program && (
                <PassportTag label={`${program.totalWeeks}-Week Program`} />
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-7 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
              Readiness Score
            </p>

            <p className="mt-3 text-6xl font-black text-[#F2B705]">
              {Math.round(Number(student.readinessScore))}%
            </p>

            <p className="mt-2 text-sm text-slate-300">Future Ready™ Index</p>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/5 px-8 py-5">
          <p className="text-sm font-semibold text-slate-200">
            Discover Purpose. Build Skills. Launch Your Future.
          </p>
        </div>
      </section>

      {!student.readinessProfile?.completedAt && (
        <section className="rounded-[32px] border-2 border-[#00A6A6] bg-[#EAFBFB] p-8 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#007C7C]">
                First Step · Required
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                {isStudentView
                  ? "Complete Your Future Ready™ Assessment"
                  : "Future Ready™ Assessment Not Completed"}
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                {isStudentView
                  ? "Before you begin your Future Ready™ journey, complete your starting assessment. This gives you a baseline of where you are today across the skills you will build throughout the program."
                  : "This student has not yet completed the required starting assessment. Their readiness results will appear here automatically after they submit it."}
              </p>

              {isStudentView ? (
                <p className="mt-3 max-w-3xl font-bold text-[#0D1B3D]">
                  There are no right or wrong answers. Answer honestly based on
                  where you are right now.
                </p>
              ) : null}
            </div>

            {isStudentView ? (
              <Link
                href={`/ambassador/student-portal/${student.id}/assessment`}
                className="shrink-0 rounded-xl bg-[#00A6A6] px-8 py-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-[#008C8C]"
              >
                Start My Assessment →
              </Link>
            ) : (
              <span className="shrink-0 rounded-xl border border-[#00A6A6] bg-white px-6 py-3 text-sm font-black text-[#007C7C]">
                Not Completed
              </span>
            )}
          </div>
        </section>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Week"
          value={String(currentWeek)}
          detail={
            totalWeeks > 0
              ? `${totalWeeks}-week student journey`
              : "Student journey"
          }
        />

        <StatCard
          label="Program Progress"
          value={`${progressPercent}%`}
          detail={`${completedLessons.length} of ${totalWeeks} lessons complete`}
        />

        <StatCard
          label="Attendance"
          value={String(attendanceCount)}
          detail="Recorded sessions"
        />

        <StatCard
          label="Portfolio"
          value={String(portfolioArtifacts.length)}
          detail={`${approvedArtifacts} approved artifacts`}
        />
      </section>

      <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#725500]">
              Graduation Project
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              {isStudentView
                ? "My Future Ready™ Story"
                : "Future Ready™ Capstone"}
            </h2>

            <p className="mt-2 text-lg font-bold text-[#4B2265]">
              Who am I beyond my role — and who am I becoming?
            </p>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
              {isStudentView
                ? "Your Capstone is the reflection book you will build throughout Future Ready™. It brings together your identity, experiences, skills, reflections, challenges, accomplishments, relationships, career exploration, and future direction into the story of who you are becoming."
                : "This student's Capstone develops throughout Future Ready™ and brings together identity, experiences, skills, reflections, challenges, accomplishments, relationships, career exploration, and future direction."}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#725500] shadow-sm">
                Chapter Zero · My Story Brain Map
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
                Evidence Saved · {portfolioArtifacts.length}
              </span>

              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#0D1B3D] shadow-sm">
                Current Connection · Week {currentWeek}
              </span>
            </div>
          </div>

          <Link
            href={`/ambassador/student-portal/${student.id}/capstone`}
            className="shrink-0 rounded-xl bg-[#0D1B3D] px-7 py-4 text-center text-lg font-black text-white shadow-lg transition hover:bg-[#162A59]"
          >
            {isStudentView
              ? "Open My Capstone →"
              : "Review Student Capstone →"}
          </Link>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            {isStudentView
              ? "Continue Your Journey"
              : "Student Journey"}
          </p>

          {currentLesson ? (
            <>
              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Week {currentLesson.weekNumber}: {currentLesson.title}
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                {currentLesson.summary ??
                  "This lesson is available in your Future Ready™ journey."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-50 px-6 py-3 font-black text-emerald-700">
                  ✓ Released for Students
                </span>

                <Link
                  href={`/ambassador/student-passport/${student.id}/reflections`}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#F2B705] px-6 py-3 font-black text-[#0D1B3D]"
                >
                  Reflection Journal
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                Your next lesson is not released yet
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                Your facilitator will release lessons as your cohort moves
                through the program.
              </p>
            </>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Passport Tools
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            My Future Ready™ Record
          </h2>

          <div className="mt-6 space-y-3">
            <ToolLink
              href={`/ambassador/student-passport/${student.id}/profile`}
              label="My Profile"
            />

            <ToolLink
              href={`/ambassador/student-passport/${student.id}/portfolio`}
              label="Digital Portfolio"
            />

            <ToolLink
              href={`/ambassador/student-passport/${student.id}/reflections`}
              label="Reflection Journal"
            />

            <ToolLink
              href={`/ambassador/student-portal/${student.id}`}
              label="Student Dashboard"
            />
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
              Future Ready™ Journey
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              {totalWeeks}-Week Progress Path
            </h2>

            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Your Passport follows the actual program assigned to your cohort.
            </p>
          </div>

          <p className="font-black text-[#0D1B3D]">
            Week {currentWeek} of {totalWeeks}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {programLessons.map((lesson) => {
            const progress = progressByLesson.get(lesson.id);

            const complete =
              Boolean(progress?.completedAt) || (progress?.percent ?? 0) >= 100;

            const released = cohortId
              ? lesson.deliverySettings.some(
                  (setting) =>
                    setting.cohortId === cohortId && setting.releasedToStudents,
                )
              : false;

            const current = lesson.weekNumber === currentWeek;

            return (
              <div
                key={lesson.id}
                className={`flex min-h-16 items-center justify-center rounded-xl border-2 font-black ${
                  complete
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : current && released
                      ? "border-[#F2B705] bg-[#FFF3C4] text-[#0D1B3D]"
                      : released
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                }`}
                title={`${lesson.title}${
                  released ? " — Released" : " — Locked"
                }`}
              >
                {complete
                  ? `✓ ${lesson.weekNumber}`
                  : current && released
                    ? `▶ ${lesson.weekNumber}`
                    : released
                      ? lesson.weekNumber
                      : `🔒 ${lesson.weekNumber}`}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Skills Dashboard
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Competency Growth
          </h2>

          {competencies.length > 0 ? (
            <div className="mt-8 space-y-6">
              {competencies.map((competency) => (
                <SkillProgress
                  key={competency.name}
                  name={competency.name}
                  score={competency.score}
                />
              ))}
            </div>
          ) : (
            <EmptyMessage text="Competency scores will appear as assessments and verified skills are completed." />
          )}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Recognition
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Badges Earned
          </h2>

          {programBadges.length > 0 ? (
            <div className="mt-8 space-y-4">
              {programBadges.map((award) => (
                <div
                  key={award.id}
                  className="flex items-center gap-4 rounded-2xl border border-[#F2B705] bg-[#FFF9E6] p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2B705] text-xl font-black text-[#0D1B3D]">
                    ✓
                  </div>

                  <div>
                    <p className="font-black text-[#0D1B3D]">
                      {award.badge.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {award.badge.description ??
                        "Future Ready™ milestone completed."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyMessage text="No badges have been earned yet." />
          )}
        </article>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Career Direction
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Career Interests
          </h2>

          {careerInterestNames.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {careerInterestNames.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-purple-50 px-4 py-2 font-bold text-purple-800"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <EmptyMessage text="Career interests have not been added yet." />
          )}

          <Link
            href={`/ambassador/student-passport/${student.id}/profile`}
            className="mt-8 inline-flex rounded-xl border-2 border-[#0D1B3D] px-6 py-3 font-black text-[#0D1B3D]"
          >
            Update Profile
          </Link>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            My Evidence
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Future Ready™ Record
          </h2>

          <div className="mt-6 space-y-4">
            <ReadinessItem
              label="Future Ready Profile"
              complete={student.profileComplete}
            />

            <ReadinessItem
              label="Career Direction"
              complete={careerInterestNames.length > 0}
            />

            <ReadinessItem
              label="Reflection Journal"
              complete={submittedReflections > 0}
            />

            <ReadinessItem
              label="Portfolio Evidence"
              complete={portfolioArtifacts.length > 0}
            />

            <ReadinessItem
              label="Verified Portfolio Evidence"
              complete={approvedArtifacts > 0}
            />
          </div>
        </article>
      </section>
    </div>
  );
}

function PassportTag({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
      {label}
    </span>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 font-bold text-slate-800 transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
    >
      {label}
      <span>→</span>
    </Link>
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

      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </article>
  );
}

function SkillProgress({ name, score }: { name: string; score: number }) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-black text-slate-800">{name}</p>

        <p className="font-black text-[#0D1B3D]">
          {Math.round(normalizedScore)}%
        </p>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#F2B705]"
          style={{
            width: `${normalizedScore}%`,
          }}
        />
      </div>
    </div>
  );
}

function ReadinessItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full font-black ${
          complete ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {complete ? "✓" : "○"}
      </div>

      <p className="font-black text-slate-800">{label}</p>
    </div>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <p className="mt-8 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-600">
      {text}
    </p>
  );
}
