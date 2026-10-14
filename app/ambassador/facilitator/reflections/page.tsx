import Link from "next/link";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const COHORT_CODE = "PILOT-2026-2027";

function formatDate(value: Date | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function statusClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-800";
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800";
    case "NEEDS_REVISION":
      return "bg-amber-100 text-amber-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default async function FacilitatorReflectionsPage() {
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
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  displayName: true,
                  email: true,
                },
              },
              reflections: {
                orderBy: {
                  updatedAt: "desc",
                },
                select: {
                  id: true,
                  prompt: true,
                  response: true,
                  status: true,
                  submittedAt: true,
                  approvedAt: true,
                  updatedAt: true,
                  lesson: {
                    select: {
                      weekNumber: true,
                      title: true,
                    },
                  },
                  feedback: {
                    orderBy: {
                      createdAt: "desc",
                    },
                    select: {
                      id: true,
                      comment: true,
                      reviewerId: true,
                      createdAt: true,
                    },
                  },
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

  const reflections = cohort.enrollments
    .flatMap(({ student }) =>
      student.reflections.map((reflection) => ({
        ...reflection,
        studentId: student.id,
        studentName:
          student.user.displayName ||
          `${student.user.firstName} ${student.user.lastName}`,
        studentEmail: student.user.email,
      }))
    )
    .sort((a, b) => {
      const aWeek = a.lesson?.weekNumber ?? 999;
      const bWeek = b.lesson?.weekNumber ?? 999;

      if (aWeek !== bWeek) {
        return aWeek - bWeek;
      }

      return a.studentName.localeCompare(b.studentName);
    });

  const submitted = reflections.filter(
    (reflection) => reflection.status === "SUBMITTED"
  ).length;

  const approved = reflections.filter(
    (reflection) => reflection.status === "APPROVED"
  ).length;

  const revision = reflections.filter(
    (reflection) => reflection.status === "NEEDS_REVISION"
  ).length;

  const drafts = reflections.filter(
    (reflection) => reflection.status === "DRAFT"
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          REFLECTIONS
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Student Reflection Review
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Review student thinking, lesson reflections, submission status,
          facilitator feedback and evidence of growth for {cohort.name}.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Submitted"
          value={submitted}
          detail="Ready for review"
        />

        <SummaryCard
          label="Approved"
          value={approved}
          detail="Review complete"
        />

        <SummaryCard
          label="Needs Revision"
          value={revision}
          detail="Student follow-up"
        />

        <SummaryCard
          label="Drafts"
          value={drafts}
          detail="Still in progress"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-black text-[#0D1B3D]">
            Cohort Reflection Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {reflections.length} reflection
            {reflections.length === 1 ? "" : "s"} currently recorded.
          </p>
        </div>

        {reflections.length === 0 ? (
          <div className="p-8">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-black text-[#0D1B3D]">
                No student reflections yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Submitted lesson reflections will appear here automatically.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reflections.map((reflection) => (
              <article
                key={reflection.id}
                className="p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-[#0D1B3D]">
                        {reflection.studentName}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(
                          reflection.status
                        )}`}
                      >
                        {statusLabel(reflection.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {reflection.studentEmail}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                        {reflection.lesson?.weekNumber
                          ? `Week ${reflection.lesson.weekNumber}`
                          : "Reflection"}
                      </p>

                      <p className="mt-1 font-black text-[#0D1B3D]">
                        {reflection.lesson?.title ||
                          "Student Reflection"}
                      </p>

                      {reflection.prompt ? (
                        <p className="mt-3 text-sm font-bold text-slate-600">
                          {reflection.prompt}
                        </p>
                      ) : null}

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {reflection.response || "No response entered."}
                      </p>
                    </div>

                    {reflection.feedback.length > 0 ? (
                      <div className="mt-4 rounded-xl border border-[#F2B705]/30 bg-[#F2B705]/10 p-4">
                        <p className="text-xs font-black uppercase tracking-wide text-[#0D1B3D]">
                          Facilitator Feedback
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {reflection.feedback[0].comment}
                        </p>

                        <p className="mt-2 text-xs font-bold text-slate-400">
                          {formatDate(
                            reflection.feedback[0].createdAt
                          )}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="w-full shrink-0 space-y-3 xl:w-48">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-black uppercase text-slate-400">
                        Submitted
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#0D1B3D]">
                        {formatDate(reflection.submittedAt)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-black uppercase text-slate-400">
                        Last Updated
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#0D1B3D]">
                        {formatDate(reflection.updatedAt)}
                      </p>
                    </div>

                    <Link
                      href={`/ambassador/student-passport/${reflection.studentId}/reflections`}
                      className="block rounded-xl bg-[#0D1B3D] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#162B59]"
                    >
                      Open Student Reflections →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm font-bold text-slate-500">
        Reflection records are connected to the existing BUILD6™
        student reflection system. This workspace does not create duplicate
        student records.
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-500">
        {detail}
      </p>
    </div>
  );
}
