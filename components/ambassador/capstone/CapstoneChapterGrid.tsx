import { futureReadyCapstone } from "@/content/ambassador/capstone";

const MONTHS = [
  {
    number: 1,
    title: "Discovering Who I Am",
    description:
      "Start with identity, influences, experiences, and the people and places that shaped you.",
    chapters: futureReadyCapstone.chapters.slice(0, 4),
  },
  {
    number: 2,
    title: "What I Bring",
    description:
      "Notice what your experiences have taught you, the skills you are building, and how your voice is developing.",
    chapters: futureReadyCapstone.chapters.slice(4, 8),
  },
  {
    number: 3,
    title: "Where I Am Going",
    description:
      "Connect challenges, values, goals, possibilities, and the person you are becoming.",
    chapters: futureReadyCapstone.chapters.slice(8, 12),
  },
];

export default function CapstoneChapterGrid() {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-6 text-slate-600">
        Your book grows over three months. Open a month when you want to see the
        story ideas inside it.
      </p>

      {MONTHS.map((month) => (
        <details
          key={month.number}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <summary className="cursor-pointer list-none p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
                  MONTH {month.number}
                </p>

                <h3 className="mt-1 text-lg font-black text-[#0D1B3D]">
                  {month.title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {month.description}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-[#0D1B3D]">
                View ▾
              </span>
            </div>
          </summary>

          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <div className="space-y-2">
              {month.chapters.map((chapter) => (
                <div
                  key={chapter.number}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 text-xs font-black text-[#4B2265]">
                      {chapter.number}
                    </div>

                    <div>
                      <h4 className="font-black text-[#0D1B3D]">
                        {chapter.title}
                      </h4>

                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
