import Link from "next/link";

import ResourcePreviewActions from "./ResourcePreviewActions";
import WeekRhythmStrip from "./WeekRhythmStrip";
import { weekOneMainDelivery } from "@/content/ambassador/week-01-main-delivery";

type Props = {
  studentId: string;
  assessmentComplete: boolean;
};

export default function StudentWeekOneFrontDoor({
  studentId,
  assessmentComplete,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
        THIS WEEK
      </p>

      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#0D1B3D]">
            Week 1 · {weekOneMainDelivery.title}
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            {weekOneMainDelivery.weeklyGoal}
          </p>
        </div>

        <Link
          href={`/ambassador/student-portal/${studentId}/lesson/1`}
          className="shrink-0 rounded-xl border border-[#0D1B3D] px-5 py-3 text-center text-sm font-black text-[#0D1B3D]"
        >
          Open Week 1
        </Link>
      </div>

      <div className="mt-6">
        <WeekRhythmStrip audience="student" studentId={studentId} />
      </div>

      <div className="mt-6 rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
          MONDAY · START IT
        </p>

        <h3 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          My Story Brain Map
        </h3>

        <p className="mt-3 max-w-3xl leading-7 text-slate-700">
          Imagine your life and future were a book. Before someone reads a
          single word, what should they feel when they see the cover?
        </p>

        <p className="mt-3 max-w-3xl leading-7 text-slate-700">
          Start collecting possibilities: colors, words, images, people, places,
          symbols, experiences, dreams, writing, career ideas, and anything else
          that feels like part of your story.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-black text-[#0D1B3D]">
              My BUILD6™ Story
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Open your graduation-project home and begin your My Story Brain
              Map.
            </p>

            <Link
              href={`/ambassador/student-portal/${studentId}/capstone`}
              className="mt-3 inline-block rounded-lg bg-[#0D1B3D] px-4 py-2 text-xs font-black text-white"
            >
              Open My Capstone →
            </Link>
          </div>

          <ResourcePreviewActions
            label="Preview Week 1 Workbook"
            previewHref="/api/ambassador/download/01/Future-Ready-Week-01-Student-Workbook.pdf"
            downloadHref="/api/ambassador/download/01/Future-Ready-Week-01-Student-Workbook.pdf?download=1"
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-black text-[#0D1B3D]">Save What Matters</div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your Digital Portfolio is where you can preserve images,
              documents, and evidence while your Capstone workspace develops.
            </p>

            <Link
              href={`/ambassador/student-passport/${studentId}/portfolio`}
              className="mt-3 inline-block rounded-lg bg-[#4B2265] px-4 py-2 text-xs font-black text-white"
            >
              Open My Portfolio
            </Link>
          </div>
        </div>

        {!assessmentComplete && (
          <div className="mt-5 rounded-2xl border border-amber-300 bg-white p-4">
            <strong className="text-[#725500]">Assessment still needed:</strong>{" "}
            <span className="text-slate-700">
              complete your baseline before the end of Monday.
            </span>
            <Link
              href={`/ambassador/student-portal/${studentId}/assessment`}
              className="ml-2 font-black text-[#0D1B3D] underline"
            >
              Complete Assessment →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
