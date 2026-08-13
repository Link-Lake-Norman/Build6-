"use client";

import { useRouter } from "next/navigation";

export default function PageHistoryControls() {
  const router = useRouter();

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#0D1B3D] transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={() => window.history.forward()}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#0D1B3D] transition hover:border-[#F2B705] hover:bg-[#FFF9E6]"
        >
          Forward →
        </button>
      </div>
    </div>
  );
}
