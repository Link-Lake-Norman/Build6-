"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResourcePreviewPage() {
  const searchParams = useSearchParams();

  const src = searchParams.get("src") ?? "";
  const name = searchParams.get("name") ?? "BUILD6™ Resource";
  const type = (searchParams.get("type") ?? "").toLowerCase();

  const docxContainer = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(type === "docx");

  useEffect(() => {
    if (type !== "docx" || !src || !docxContainer.current) {
      return;
    }

    let cancelled = false;

    async function loadDocx() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(src, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Unable to open document (${response.status}).`);
        }

        const blob = await response.blob();

        const { renderAsync } = await import("docx-preview");

        if (!cancelled && docxContainer.current) {
          docxContainer.current.innerHTML = "";

          await renderAsync(blob, docxContainer.current, undefined, {
            className: "future-ready-docx",
            inWrapper: true,
            breakPages: true,
            ignoreWidth: false,
            ignoreHeight: false,
          });
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to preview this document."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDocx();

    return () => {
      cancelled = true;
    };
  }, [src, type]);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              FUTURE READY™ RESOURCE PREVIEW
            </p>

            <h1 className="mt-1 text-xl font-black text-[#0D1B3D]">
              {name}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.close()}
              className="rounded-xl border border-[#0D1B3D] px-4 py-2 text-sm font-black text-[#0D1B3D]"
            >
              Close Preview
            </button>

            <a
              href={`${src}${src.includes("?") ? "&" : "?"}download=1`}
              className="rounded-xl bg-[#0D1B3D] px-4 py-2 text-sm font-black text-white"
            >
              Download
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl p-5 md:p-8">
        {type === "pdf" && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <iframe
              src={src}
              title={name}
              className="h-[calc(100vh-150px)] min-h-[700px] w-full"
            />
          </div>
        )}

        {type === "docx" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
            {loading && (
              <p className="font-bold text-slate-500">
                Loading document preview...
              </p>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <div ref={docxContainer} className="overflow-x-auto" />
          </div>
        )}

        {type === "pptx" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="text-2xl font-black text-[#0D1B3D]">
              PowerPoint Preview
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-700">
              This slide deck is protected and cannot be reliably rendered by
              the browser's native viewer. Use Download for now while the
              protected slide preview is added.
            </p>

            <a
              href={`${src}${src.includes("?") ? "&" : "?"}download=1`}
              className="mt-6 inline-flex rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
            >
              Download Slides
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
