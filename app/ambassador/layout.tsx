import type { ReactNode } from "react";
import Image from "next/image";

export default function AmbassadorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#4B2265]">
              Ambassador Christian School
            </p>

            <h1 className="mt-2 text-2xl font-bold text-[#0D1B3D]">
              Future Ready™ Pilot Program
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Discover Purpose. Build Skills. Launch Your Future.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Powered by
              </p>

              <Image
                src="/brand/future-ready-logo.svg"
                alt="Future Ready"
                width={190}
                height={55}
                priority
                className="mt-2 h-auto w-[175px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </div>
    </div>
  );
}