import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7FAFC]">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">

          <div className="border-b-4 border-[#F4B942] bg-[#0B3B60] px-8 py-10 text-white md:px-14 md:py-14">
            <div className="text-sm font-black uppercase tracking-[0.22em] text-[#F4B942]">
              Future Ready™
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Discover Purpose.
              <br />
              Build Skills.
              <br />
              Launch Your Future.
            </h1>
          </div>

          <div className="px-8 py-10 md:px-14 md:py-14">
            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-slate-600">
                Future Ready™ is a workforce readiness and career
                development experience designed to help students build
                the skills, confidence, and real-world awareness they
                need for what comes next.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="#about"
                  className="rounded-xl border border-[#0B3B60] px-6 py-3 font-black text-[#0B3B60] transition hover:bg-slate-50"
                >
                  Learn More
                </Link>

                <Link
                  href="/ambassador/login"
                  className="rounded-xl bg-[#F4B942] px-6 py-3 font-black text-[#0B3B60] transition hover:brightness-95"
                >
                  Ambassador Login
                </Link>
              </div>
            </div>

            <section
              id="about"
              className="mt-14 border-t border-slate-200 pt-10"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00A6A6]">
                About Future Ready™
              </p>

              <h2 className="mt-3 text-3xl font-black text-[#0B3B60]">
                Preparing students for what comes next.
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Future Ready™ connects career exploration, professional
                skills, applied learning, and real-world preparation in
                one student-centered experience.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
