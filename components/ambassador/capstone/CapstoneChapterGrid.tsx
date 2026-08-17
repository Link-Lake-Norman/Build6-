import { futureReadyCapstone } from "@/content/ambassador/capstone";

export default function CapstoneChapterGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {futureReadyCapstone.chapters.map((chapter) => (
        <div
          key={chapter.number}
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="text-xs font-black tracking-[0.18em] text-[#4B2265]">
            CHAPTER {chapter.number}
          </div>

          <h3 className="mt-2 text-lg font-black text-[#0D1B3D]">
            {chapter.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {chapter.description}
          </p>
        </div>
      ))}
    </div>
  );
}
