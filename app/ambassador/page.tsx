import Link from "next/link";
import StatCard from "@/components/StatCard";
import {
  facilitators,
  organization,
  students,
} from "@/content/platform";

export default function AmbassadorDashboardPage() {
  const averageReadiness = Math.round(
    students.reduce(
      (total, student) =>
        total + student.readinessScore,
      0
    ) / students.length
  );

  return (
    <div className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          Ambassador Christian School
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Future Ready™ Pilot Dashboard
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Launch Ready™ Professional Skills & Internship
          Readiness Program
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Students"
          value={students.length}
          detail="Active pilot participants"
        />

        <StatCard
          label="Facilitators"
          value={facilitators.length}
          detail="Assigned school facilitators"
        />

        <StatCard
          label="Current Week"
          value={organization.currentWeek}
          detail="36-week curriculum"
        />

        <StatCard
          label="Average Readiness"
          value={`${averageReadiness}%`}
          detail="Current cohort score"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <DashboardLink
          href="/ambassador/facilitator"
          title="Facilitator Portal"
          description="Lessons, attendance, student progress, notes, and weekly tools."
        />

        <DashboardLink
          href="/ambassador/student-portal/ambassador-student-001"
          title="Student Experience"
          description="Student record, readiness, skills, badges, and curriculum."
        />

        <DashboardLink
          href="/ambassador/admin"
          title="School Administration"
          description="Students, facilitators, cohorts, and program management."
        />

        <DashboardLink
          href="/ambassador/facilitator/attendance"
          title="Attendance"
          description="Record weekly attendance for all twenty students."
        />

        <DashboardLink
          href="/ambassador/facilitator/students"
          title="Student Roster"
          description="Review readiness, attendance, status, and student records."
        />

        <DashboardLink
          href="/ambassador/curriculum/1"
          title="Curriculum"
          description="Open the complete 36-week Future Ready™ curriculum."
        />
      </section>
    </div>
  );
}

function DashboardLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-[#F2B705] hover:shadow-md"
    >
      <h2 className="text-2xl font-black text-[#0D1B3D]">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

      <p className="mt-6 font-black text-[#0D1B3D]">
        Open →
      </p>
    </Link>
  );
}
