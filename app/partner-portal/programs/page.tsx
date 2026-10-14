import Link from "next/link";
import { curriculum } from "@/content/curriculum";

export default function PartnerProgramsPage() {
  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="rounded-3xl bg-[#0D1B3D] p-10 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          BUILD6™
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Curriculum Programs
        </h1>

        <p className="mt-4 text-lg text-slate-200">
          Review the complete BUILD6™ curriculum sequence available
          to schools, employers and community partners.
        </p>
      </div>

      <div className="grid gap-6">
        {curriculum.map((item) => (
          <article
            key={item.week}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm uppercase tracking-wide font-bold text-[#F2B705]">
                  Week {item.week}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#0D1B3D]">
                  {item.title}
                </h2>

                <p className="mt-3 text-slate-600">
                  {item.phase}
                </p>
              </div>

              <Link
                href={`/ambassador/curriculum/${item.week}`}
                className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-bold text-white"
              >
                View Lesson
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Learning Objective
                </p>

                <p className="mt-2">
                  {item.objective}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Portfolio Evidence
                </p>

                <p className="mt-2">
                  {item.portfolioEvidence}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase text-slate-500 mb-3">
                Skills Earned
              </p>

              <div className="flex flex-wrap gap-2">
                {item.skillsEarned.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-[#FFF3C4] px-3 py-1 text-sm font-semibold text-[#0D1B3D]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
