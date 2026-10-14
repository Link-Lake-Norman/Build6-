import Link from "next/link";
import { employerOpportunities } from "@/content/employer-opportunities";

export default function EmployerOpportunitiesPage() {
  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="rounded-3xl bg-[#0D1B3D] text-white p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-[#F2B705] font-bold">
          BUILD6™ Employer Hub
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Opportunities
        </h1>

        <p className="mt-4 text-lg text-slate-200 max-w-3xl">
          Explore internships, mentoring, workplace projects and career
          experiences available to BUILD6™ students.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {employerOpportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#F2B705]">
                  {opportunity.type}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#0D1B3D]">
                  {opportunity.title}
                </h2>

                <p className="mt-2 text-slate-600 font-semibold">
                  {opportunity.company}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                {opportunity.status}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Industry
                </p>

                <p className="font-semibold mt-1">
                  {opportunity.industry}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Opportunity Type
                </p>

                <p className="font-semibold mt-1">
                  {opportunity.type}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase text-slate-500 mb-3">
                Skills
              </p>

              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#FFF3C4] px-3 py-1 text-sm font-semibold text-[#0D1B3D]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Link
                href={`/employer-hub/opportunities/${opportunity.id}`}
                className="inline-flex rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white hover:bg-[#172B55]"
              >
                View Opportunity
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
    
  );
}