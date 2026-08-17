import Link from "next/link";

import { futureReadyCapstone } from "@/content/ambassador/capstone";

type Props = {
  studentId: string;
};

export default function CapstoneBrainMap({ studentId }: Props) {
  return (
    <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6 md:p-8">
      <p className="text-xs font-black tracking-[0.18em] text-[#725500]">
        {futureReadyCapstone.weekOne.label} · START IT
      </p>

      <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
        {futureReadyCapstone.weekOne.title}
      </h2>

      <p className="mt-4 max-w-4xl text-lg font-bold leading-8 text-slate-800">
        {futureReadyCapstone.weekOne.prompt}
      </p>

      <p className="mt-3 max-w-4xl leading-7 text-slate-700">
        {futureReadyCapstone.weekOne.instruction}
      </p>

      <div className="mt-7 grid gap-3 md:grid-cols-2">
        {futureReadyCapstone.weekOne.categories.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-amber-200 bg-white p-5"
          >
            <div className="text-xs font-black tracking-[0.12em] text-[#4B2265]">
              {item.title}
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {item.prompt}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl border border-amber-300 bg-white p-5">
        <h3 className="font-black text-[#0D1B3D]">
          Start With Three Decisions
        </h3>

        <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
          <p>
            <strong>1.</strong> I want someone to feel...
          </p>

          <p>
            <strong>2.</strong> Three words that belong in my story...
          </p>

          <p>
            <strong>3.</strong> Colors, images, textures, or styles I want to
            explore...
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#0D1B3D] p-5 text-white">
        <div className="font-black">KEEP WHAT MATTERS</div>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200">
          Keep photographs, screenshots, documents, writing, links, and other
          pieces that may become part of your story. Your Digital Portfolio is
          your evidence archive while your Capstone develops.
        </p>

        <Link
          href={`/ambassador/student-passport/${studentId}/portfolio`}
          className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-xs font-black text-[#0D1B3D]"
        >
          Open My Digital Portfolio →
        </Link>
      </div>
    </section>
  );
}
