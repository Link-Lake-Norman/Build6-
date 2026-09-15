import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import StudentAssignments from "@/components/student/StudentAssignments";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentAssignmentsPage({ params }: PageProps) {
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

  const releasedLessons = enrollment.cohort.program.modules.flatMap(
    (module) => module.lessons,
  );

  const currentLesson =
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

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Only work connected to lessons your facilitator has opened appears
          here.
        </p>
      </section>

      {currentLesson ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
              CURRENT LESSON
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
              Week {currentLesson.weekNumber}: {currentLesson.title}
            </h2>

            <Link
              href={`/ambassador/student-portal/${student.id}/lesson/${currentLesson.weekNumber}`}
              className="mt-3 inline-flex text-sm font-black text-[#4B2265]"
            >
              Open lesson →
            </Link>
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
