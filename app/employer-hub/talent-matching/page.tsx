import { matches } from "@/content/matches";

export default function TalentMatchingPage() {
  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="rounded-3xl bg-[#0D1B3D] p-10 text-white">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F2B705]">
          BUILD6™ Employer Hub
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Talent Matching
        </h1>

        <p className="mt-4 text-lg text-slate-200">
          Review recommended students for internships and career opportunities.
        </p>
      </div>

      <div className="space-y-6">
        {matches.map((match) => (
          <article
            key={match.id}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B3D]">
                  {match.student}
                </h2>

                <p className="mt-2 text-slate-600">
                  {match.opportunity}
                </p>

                <p className="mt-1 font-semibold text-slate-700">
                  {match.employer}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                {match.status}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold uppercase text-slate-500">
                Match Score
              </p>

              <div className="mt-3 h-4 rounded-full bg-slate-200">
                <div
                  className="h-4 rounded-full bg-[#F2B705]"
                  style={{
                    width: `${match.matchScore}%`,
                  }}
                />
              </div>

              <p className="mt-2 font-bold text-[#0D1B3D]">
                {match.matchScore}%
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm font-bold uppercase text-slate-500">
                Why This Match
              </p>

              <ul className="mt-3 list-disc pl-6 space-y-2">
                {match.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}