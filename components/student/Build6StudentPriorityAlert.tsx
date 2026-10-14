import Link from "next/link";

type Props = {
  studentId: string;
};

export default function Build6StudentPriorityAlert({ studentId }: Props) {
  return (
    <aside
      aria-label="BUILD6 student progress alert"
      className="mx-auto mb-5 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-800">
              🚨 BUILD6 Progress Alert
            </p>
            <p className="mt-1 text-lg font-black text-[#0D1B3D]">
              Finish your assigned workbook pages. Build your capstone as you go.
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-700">
              You are past the halfway point. Workbook responses, reflections,
              research, decisions, and evidence become the material you need for
              your capstone and successful class completion. Missing work now
              means missing evidence later.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              href={`/ambassador/student-portal/${studentId}/assignments`}
              className="rounded-xl bg-[#0D1B3D] px-4 py-2.5 text-sm font-black text-white"
            >
              Finish My Work →
            </Link>
            <Link
              href={`/ambassador/student-portal/${studentId}/capstone`}
              className="rounded-xl border-2 border-[#4B2265] bg-white px-4 py-2.5 text-sm font-black text-[#4B2265]"
            >
              Build My Capstone →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
