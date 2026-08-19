import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AmbassadorAdminPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (
    session.role !== "SUPER_ADMIN" &&
    session.role !== "ORGANIZATION_ADMIN" &&
    session.role !== "SCHOOL_ADMIN"
  ) {
    redirect("/ambassador");
  }

  const pilot = await prisma.cohort.findFirst({
    where: {
      code: "PILOT-2026-2027",
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      capacity: true,
      school: {
        select: {
          name: true,
        },
      },
      program: {
        select: {
          name: true,
          totalWeeks: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
          facilitators: true,
        },
      },
    },
  });

  const [
    totalStudents,
    totalFacilitators,
    totalCohorts,
    pendingPasswordResets,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.facilitator.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.cohort.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.passwordResetRequest.count({
      where: {
        status: "PENDING",
      },
    }),
  ]);

  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white shadow-lg">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          Future Ready™ Administration
        </p>

        <h1 className="mt-3 text-4xl font-black">Welcome, {session.name}</h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Manage cohorts, facilitators, students, curriculum delivery, and the
          Ambassador Christian School pilot.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full bg-[#F2B705] px-4 py-2 text-sm font-black text-[#0D1B3D]">
            {session.role}
          </span>

          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
            Full Platform Access
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Students"
          value={totalStudents}
          detail="Platform student records"
        />

        <Metric
          label="Facilitators"
          value={totalFacilitators}
          detail="Facilitator accounts"
        />

        <Metric label="Cohorts" value={totalCohorts} detail="Program cohorts" />
        <Metric
          label="Password Help"
          value={pendingPasswordResets}
          detail={
            pendingPasswordResets === 1
              ? "Reset request needs attention"
              : "Reset requests need attention"
          }
        />

        <Metric
          label="Pilot Students"
          value={pilot?._count.enrollments ?? 0}
          detail="Pilot Class 2026-2027"
        />
      </section>

      {pilot ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Current Pilot
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-3xl font-black text-[#0D1B3D]">
                {pilot.name}
              </h2>

              <p className="mt-2 text-slate-600">
                {pilot.school?.name ?? "Ambassador Christian School"}
              </p>

              <p className="mt-1 text-slate-600">{pilot.program.name}</p>
            </div>

            <div className="rounded-2xl bg-[#FFF9DF] px-5 py-4">
              <p className="text-xs font-black uppercase text-[#725500]">
                Student Class Code
              </p>

              <p className="mt-1 text-xl font-black text-[#0D1B3D]">
                {pilot.code}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SmallMetric label="Students" value={pilot._count.enrollments} />

            <SmallMetric
              label="Facilitators"
              value={pilot._count.facilitators}
            />

            <SmallMetric
              label="Program Weeks"
              value={pilot.program.totalWeeks}
            />
          </div>
        </section>
      ) : null}

      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          Administration
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Manage Future Ready™
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AdminCard
            title={
              pendingPasswordResets > 0
                ? `Password Help · ${pendingPasswordResets}`
                : "Password Help"
            }
            description={
              pendingPasswordResets > 0
                ? "A student has requested help getting back into their account."
                : "Review student password-reset requests."
            }
            href="/ambassador/admin/password-resets"
            action={
              pendingPasswordResets > 0
                ? "Review Requests"
                : "Open Password Help"
            }
          />

          <AdminCard
            title="Cohorts"
            description="View classes, enrollment codes, student counts, and create future cohorts."
            href="/ambassador/admin/cohorts"
            action="Manage Cohorts"
          />

          <AdminCard
            title="Students"
            description="Open the live database roster and review student progress and passports."
            href="/ambassador/facilitator/students"
            action="View Students"
          />

          <AdminCard
            title="Assessment Results"
            description="Review Day 1 readiness scores and student responses in one class sheet."
            href="/ambassador/facilitator/assessments"
            action="View Assessments"
          />

          <AdminCard
            title="Command Center"
            description="Open the Ambassador operational command center."
            href="/ambassador/admin/command-center"
            action="Open Command Center"
          />

          <AdminCard
            title="Month Ahead"
            description="View, add, and edit upcoming topics, speakers, field experiences, and preparation."
            href="/ambassador/calendar"
            action="Open Calendar"
          />

          <AdminCard
            title="Curriculum"
            description="Manage the 16-week Launch Ready™ classroom experience."
            href="/ambassador/curriculum"
            action="Open Curriculum"
          />

          <AdminCard
            title="Lesson Builder"
            description="Manage lesson activities and instructional resources."
            href="/ambassador/lesson-builder"
            action="Open Lesson Builder"
          />

          <AdminCard
            title="Permissions"
            description="Review platform access and administrative permissions."
            href="/ambassador/admin/permissions"
            action="Manage Permissions"
          />

          <AdminCard
            title="Messages"
            description="Communicate with students, facilitators, and authorized program administrators."
            href="/ambassador/messages"
            action="Open Messages"
          />
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-4xl font-black text-[#0D1B3D]">{value}</p>

      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </article>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-black text-[#0D1B3D]">{value}</p>
    </div>
  );
}

function AdminCard({
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
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black text-[#0D1B3D]">{title}</h3>

      <p className="mt-3 min-h-16 leading-7 text-slate-600">{description}</p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
      >
        {action} →
      </Link>
    </article>
  );
}
