import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const COHORT_CODE = "PILOT-2026-2027";

export default async function AssessmentsPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
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
              gradeLevel: true,
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

  if (!cohort) {
    return <p>Ambassador cohort not found.</p>;
  }

  const students = cohort.enrollments.map(({ student }) => {
    const profile = student.readinessProfile;

    const scores = profile
      ? [
          Number(profile.selfAwareness),
          Number(profile.communication),
          Number(profile.leadership),
          Number(profile.professionalPresence),
          Number(profile.careerReadiness),
          Number(profile.adaptability),
          Number(profile.aiReadiness),
        ]
      : [];

    const available = scores.filter((score) => score > 0);

    const readiness =
      available.length > 0
        ? Math.round(
            available.reduce((sum, score) => sum + score, 0) /
              available.length
          )
        : null;

    const status = profile?.completedAt
      ? "Completed"
      : student.readinessResponses.length > 0
      ? "In Progress"
      : "Not Started";

    return {
      id: student.id,
      name:
        student.user.displayName ||
        `${student.user.firstName} ${student.user.lastName}`,
      email: student.user.email,
      gradeLevel: student.gradeLevel,
      readiness,
      status,
      responses: student.readinessResponses.length,
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          ASSESSMENTS
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Student Readiness
        </h1>

        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Review readiness baseline completion and existing student
          assessment records for {cohort.name}.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-black text-[#0D1B3D]">
            Cohort Assessment Status
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((student) => (
            <div
              key={student.id}
              className="grid gap-4 p-5 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
            >
              <div>
                <p className="font-black text-[#0D1B3D]">
                  {student.name}
                </p>

                <p className="text-sm text-slate-500">
                  {student.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-slate-400">
                  Status
                </p>
                <p className="font-bold text-[#0D1B3D]">
                  {student.status}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-slate-400">
                  Readiness
                </p>
                <p className="font-black text-[#0D1B3D]">
                  {student.readiness !== null
                    ? `${student.readiness}%`
                    : "—"}
                </p>
              </div>

              <Link
                href={`/ambassador/student-portal/${student.id}/assessment`}
                className="rounded-xl bg-[#0D1B3D] px-4 py-3 text-center text-sm font-black text-white"
              >
                View Assessment →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm font-bold text-slate-500">
        Read-only facilitator view. Existing student assessment records are unchanged.
      </p>
    </div>
  );
}
