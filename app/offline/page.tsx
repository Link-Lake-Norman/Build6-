export default function Build6OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D1B3D] px-6 text-white">
      <section className="w-full max-w-lg rounded-3xl border border-white/15 bg-white/10 p-8 text-center shadow-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F2B705] text-3xl font-black text-[#0D1B3D]">
          B6
        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          BUILD6™ STUDENT COMPANION
        </p>

        <h1 className="mt-3 text-3xl font-black">
          You&apos;re offline right now.
        </h1>

        <p className="mt-4 leading-7 text-slate-200">
          Your private student information is intentionally not stored
          offline. Reconnect to the internet and reopen BUILD6 to continue
          your assignments, journal, messages and program activity.
        </p>

        <a
          href="/ambassador"
          className="mt-7 inline-block rounded-xl bg-[#F2B705] px-6 py-3 text-sm font-black text-[#0D1B3D]"
        >
          TRY AGAIN
        </a>

        <p className="mt-7 text-xs text-slate-400">
          © 2026 LINK Lake Norman, LLC
        </p>
      </section>
    </main>
  );
}
