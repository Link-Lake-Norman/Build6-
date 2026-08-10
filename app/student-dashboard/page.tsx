import Link from "next/link";
import { student } from "@/content/student";

export default function StudentDashboardPage() {
  return (
    <main className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="rounded-3xl bg-[#0D1B3D] text-white p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-[#F2B705] font-bold">
          Future Ready™
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Welcome, {student.name}
        </h1>

        <p className="mt-4 text-lg text-slate-200">
          Discover Purpose. Build Skills. Launch Your Future.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm uppercase text-slate-500">
            Current Phase
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            {student.currentPhase}
          </h2>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm uppercase text-slate-500">
            Overall Progress
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#0D1B3D]">
            {student.progress}%
          </h2>

          <div className="mt-4 h-4 rounded-full bg-slate-200">
            <div
              className="h-4 rounded-full bg-[#F2B705]"
              style={{
                width: `${student.progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-[#0D1B3D]">
          Skills Progress
        </h2>

        <div className="mt-8 space-y-6">
          {student.skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between">
                <span className="font-semibold">
                  {skill.name}
                </span>

                <span>{skill.progress}%</span>
              </div>

              <div className="mt-2 h-3 rounded-full bg-slate-200">
                <div
                  className="h-3 rounded-full bg-[#0D1B3D]"
                  style={{
                    width: `${skill.progress}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/academy"
          className="mt-8 inline-flex rounded-xl bg-[#0D1B3D] px-6 py-3 font-bold text-white"
        >
          Continue Learning
        </Link>
      </section>
    </main>
  );
}
