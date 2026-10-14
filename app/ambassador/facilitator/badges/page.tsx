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

export default async function FacilitatorBadgesPage() {
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
      id: true,
      name: true,
      programId: true,
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
              badgeAwards: {
                orderBy: {
                  awardedAt: "desc",
                },
                select: {
                  id: true,
                  source: true,
                  approvedById: true,
                  evidence: true,
                  awardedAt: true,
                  badge: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      description: true,
                      imageUrl: true,
                      isActive: true,
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

  const badgeCatalog = await prisma.badge.findMany({
    where: {
      isActive: true,
      OR: [
        {
          programId: cohort.programId,
        },
        {
          programId: null,
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      programId: true,
      _count: {
        select: {
          awards: true,
        },
      },
    },
  });

  const students = cohort.enrollments.map(({ student }) => ({
    id: student.id,
    name:
      student.user.displayName ||
      `${student.user.firstName} ${student.user.lastName}`,
    email: student.user.email,
    awards: student.badgeAwards.filter(
      (award) =>
        award.badge.isActive &&
        badgeCatalog.some((badge) => badge.id === award.badge.id)
    ),
  }));

  const totalAwards = students.reduce(
    (sum, student) => sum + student.awards.length,
    0
  );

  const studentsWithBadges = students.filter(
    (student) => student.awards.length > 0
  ).length;

  const studentsWithoutBadges = students.length - studentsWithBadges;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
          BADGES + RECOGNITION
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Student Badge Review
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Review badges already awarded to students in {cohort.name},
          monitor recognition across the cohort, and open individual
          student Passports for supporting evidence.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active Students"
          value={students.length}
          detail="Current cohort roster"
        />

        <SummaryCard
          label="Badge Awards"
          value={totalAwards}
          detail="Awards currently recorded"
        />

        <SummaryCard
          label="Students Recognized"
          value={studentsWithBadges}
          detail="At least one badge"
        />

        <SummaryCard
          label="Not Yet Recognized"
          value={studentsWithoutBadges}
          detail="No badge awards yet"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-black text-[#0D1B3D]">
            Cohort Badge Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Existing BadgeAward records only. No new awards are created
            from this view.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((student) => (
            <article
              key={student.id}
              className="p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-black text-[#0D1B3D]">
                    {student.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {student.email}
                  </p>

                  {student.awards.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                      <p className="text-sm font-bold text-slate-500">
                        No badges awarded yet.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {student.awards.map((award) => (
                        <div
                          key={award.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2B705]/20 text-xl">
                              🏅
                            </div>

                            <div>
                              <p className="font-black text-[#0D1B3D]">
                                {award.badge.name}
                              </p>

                              {award.badge.description ? (
                                <p className="mt-1 text-sm leading-5 text-slate-600">
                                  {award.badge.description}
                                </p>
                              ) : null}

                              <p className="mt-2 text-xs font-bold text-slate-400">
                                Awarded {formatDate(award.awardedAt)}
                              </p>

                              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                                Source: {award.source}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full shrink-0 xl:w-52">
                  <Link
                    href={`/ambassador/student-passport/${student.id}`}
                    className="block rounded-xl bg-[#0D1B3D] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#162B59]"
                  >
                    Open Student Passport →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-[#0D1B3D]">
          Active Badge Catalog
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Badges currently available in the connected database.
        </p>

        {badgeCatalog.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <p className="font-bold text-slate-500">
              No active database badges are configured yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {badgeCatalog.map((badge) => (
              <div
                key={badge.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="font-black text-[#0D1B3D]">
                  {badge.name}
                </p>

                {badge.description ? (
                  <p className="mt-2 text-sm leading-5 text-slate-600">
                    {badge.description}
                  </p>
                ) : null}

                <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-400">
                  {badge._count.awards} award
                  {badge._count.awards === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm font-bold text-slate-500">
        This page reads from the existing BUILD6™ Badge and
        BadgeAward records. Student Passport badge records remain the
        source of truth.
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
