import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import StudentAssignments from "@/components/student/StudentAssignments";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    week?: string;
  }>;
};

export default async function StudentAssignmentsPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  const requestedWeek = Number(query.week ?? "0");

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
      enrollments: {
        where: {
          status: "ACTIVE",
        },
        take: 1,
        select: {
          cohort: {
            select: {
              id: true,
              program: {
                select: {
                  modules: {
                    select: {
                      lessons: {
                        where: {
                          status: "ACTIVE",
                          deliverySettings: {
                            some: {
                              cohortId: access.cohortIds[0],
                              releasedToStudents: true,
                            },
                          },
                        },
                        orderBy: {
                          weekNumber: "asc",
                        },
                        select: {
                          id: true,
                          title: true,
                          weekNumber: true,
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
      lessonProgress: {
        select: {
          lessonId: true,
          percent: true,
          completedAt: true,
        },
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

  const releasedLessons = enrollment.cohort.program.modules
    .flatMap((module) => module.lessons)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const requestedLesson =
    Number.isInteger(requestedWeek) && requestedWeek > 0
      ? releasedLessons.find((lesson) => lesson.weekNumber === requestedWeek) ??
        null
      : null;

  const currentLesson =
    requestedLesson ??
    releasedLessons.find((lesson) => {
      const progress = student.lessonProgress.find(
        (item) => item.lessonId === lesson.id,
      );

      return (
        !progress || (progress.completedAt === null && progress.percent < 100)
      );
    }) ??
    releasedLessons[releasedLessons.length - 1] ??
    null;

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-7 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          ASSIGNMENTS
        </p>

        <h1 className="mt-2 text-3xl font-black">What I Need to Finish</h1>

        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-300">
          Your weekly workbook and current assignments are here. Green ✓ means
          submitted. If you already completed work but saved it as a draft,
          you will see an amber reminder to review it and click Submit.
        </p>
      </section>


      {currentLesson ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
              WORK AREA
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              Week {currentLesson.weekNumber}: {currentLesson.title}
            </h2>

            <div className="mt-3 flex flex-wrap gap-4">
                          {/* BUILD6_ASSIGNMENTS_WORKBOOK_CTA_V1 */}
            {currentLesson.weekNumber !== 15 ? (
              <a
                href={`/api/ambassador/download/week-${String(currentLesson.weekNumber).padStart(2, "0")}/${encodeURIComponent(
                  `Future-Ready-Week-${String(currentLesson.weekNumber).padStart(2, "0")}-Student-Workbook.pdf`,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mb-3 inline-flex rounded-xl border-2 border-[#F2B705] bg-[#FFF9DF] px-4 py-2.5 text-sm font-black text-[#0D1B3D]"
              >
                📘 Open Week {currentLesson.weekNumber} Workbook — use it for every assigned day
              </a>
            ) : null}

<Link
                href={`/ambassador/student-portal/${student.id}/lesson/${currentLesson.weekNumber}`}
                className="text-sm font-black text-[#4B2265]"
              >
                Open Week {currentLesson.weekNumber} lesson →
              </Link>

              <Link
                href={`/ambassador/student-portal/${student.id}`}
                className="text-sm font-black text-[#0D1B3D]"
              >
                My Dashboard →
              </Link>
            </div>
          </div>

          <StudentAssignments
            studentId={student.id}
            lessonId={currentLesson.id}
          />
        </section>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-2xl font-black text-[#0D1B3D]">
            Nothing assigned right now.
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            New work will appear here when your facilitator opens it.
          </p>
        </section>
      )}
    </main>
  );
}
