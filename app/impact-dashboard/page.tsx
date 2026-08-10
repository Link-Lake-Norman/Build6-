import { impact } from "@/content/impact";

export default function ImpactDashboardPage() {
  return (
    <main className="space-y-10">
      <header className="rounded-3xl bg-[#0D1B3D] px-8 py-10 text-white shadow-lg">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#F2B705]">
          Future Ready™ Impact
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Workforce Readiness Impact Dashboard
        </h1>

        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-200">
          Track student participation, employer engagement,
          internship growth, skills development, and program
          completion across the Future Ready™ ecosystem.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ImpactCard
          label="Students Served"
          value={impact.studentsServed}
          detail="Students participating in Future Ready™"
        />

        <ImpactCard
          label="Active Schools"
          value={impact.schoolsActive}
          detail="Schools and organizations using the platform"
        />

        <ImpactCard
          label="Employers Connected"
          value={impact.employersConnected}
          detail="Employer and workforce partners"
        />

        <ImpactCard
          label="Internships Created"
          value={impact.internshipsCreated}
          detail="Internship and work-based learning opportunities"
        />

        <ImpactCard
          label="Skills Developed"
          value={impact.skillsDeveloped}
          detail="Documented workforce-readiness skills"
        />

        <ImpactCard
          label="Badges Earned"
          value={impact.badgesEarned}
          detail="Milestones and competencies recognized"
        />

        <ImpactCard
          label="Completion Rate"
          value={`${impact.completionRate}%`}
          detail="Program completion across active cohorts"
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
            Student Outcomes
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            Readiness Growth
          </h2>

          <div className="mt-8 space-y-5">
            <MetricRow
              label="Students Served"
              value={impact.studentsServed}
            />

            <MetricRow
              label="Skills Developed"
              value={impact.skillsDeveloped}
            />

            <MetricRow
              label="Badges Earned"
              value={impact.badgesEarned}
            />

            <MetricRow
              label="Completion Rate"
              value={`${impact.completionRate}%`}
            />
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
            Ecosystem Growth
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            School and Employer Reach
          </h2>

          <div className="mt-8 space-y-5">
            <MetricRow
              label="Active Schools"
              value={impact.schoolsActive}
            />

            <MetricRow
              label="Employers Connected"
              value={impact.employersConnected}
            />

            <MetricRow
              label="Internships Created"
              value={impact.internshipsCreated}
            />
          </div>
        </article>
      </section>
    </main>
  );
}

function ImpactCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-[#0D1B3D]">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
      <span className="font-semibold text-slate-700">
        {label}
      </span>

      <span className="text-xl font-black text-[#0D1B3D]">
        {value}
      </span>
    </div>
  );
}