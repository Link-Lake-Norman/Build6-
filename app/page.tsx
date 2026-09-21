import Link from "next/link";

const stages = [
  ["01", "DISCOVER", "Who you are"],
  ["02", "DEVELOP", "Your skills"],
  ["03", "EXPLORE", "Your options"],
  ["04", "CONNECT", "With people"],
  ["05", "EXPERIENCE", "The real world"],
  ["06", "LAUNCH", "Your future"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7FAFC] text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="border-b-4 border-[#F4B942] bg-[#0B3B60] px-8 py-10 text-white md:px-14 md:py-14">
            <div className="text-sm font-black uppercase tracking-[0.22em] text-[#F4B942]">
              BUILD6™ • Build What&apos;s Next
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Discover Purpose.
              <br />
              Build Skills.
              <br />
              Launch Your Future.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              A six-stage career-readiness experience that helps students understand
              themselves, build durable skills, explore possibilities, connect with
              people, gain real-world experience, and prepare to launch.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="#journey" className="rounded-xl bg-[#F4B942] px-6 py-3 font-black text-[#0B3B60] transition hover:brightness-95">
                Explore the Six Stages
              </Link>
              <Link href="#proof" className="rounded-xl border border-white/40 px-6 py-3 font-black text-white transition hover:bg-white/10">
                See BUILD6 in Action
              </Link>
              <Link href="/ambassador/login" className="rounded-xl border border-white/40 px-6 py-3 font-black text-white transition hover:bg-white/10">
                Ambassador Login
              </Link>
            </div>
          </div>

          <div className="px-8 py-10 md:px-14 md:py-14">
            <section id="journey">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#00A6A6]">The BUILD6™ Journey</p>
              <h2 className="mt-3 text-3xl font-black text-[#0B3B60]">Six stages. One connected path forward.</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Career readiness is more than choosing a job. BUILD6™ moves students from
                self-awareness to skill-building, career exploration, relationships,
                real-world experience, and a confident next step.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stages.map(([n, name, line]) => (
                  <div key={name} className="rounded-2xl border border-slate-200 bg-[#F7FAFC] p-5">
                    <div className="text-xs font-black tracking-[0.18em] text-[#F4B942]">{n}</div>
                    <div className="mt-2 text-lg font-black text-[#0B3B60]">{name}™</div>
                    <div className="mt-1 text-sm text-slate-600">{line}</div>
                  </div>
                ))}
              </div>
            </section>

            <section id="proof" className="mt-16 overflow-hidden rounded-[28px] border border-slate-200 bg-[#0B3B60] text-white shadow-lg">
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="p-8 md:p-10">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F4B942]">The Proof Behind BUILD6™</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">
                    Before BUILD6™ had its name, the model was already in motion.
                  </h2>
                  <p className="mt-5 leading-7 text-slate-200">
                    BUILD6™ grew from real career-readiness work with students, employers,
                    mentors, and community partners. The original Future Ready experience
                    helped shape the practical, student-centered model that evolved into
                    today&apos;s six-stage BUILD6™ journey.
                  </p>
                  <div className="mt-7 rounded-2xl border border-white/15 bg-white/10 p-5">
                    <p className="font-black text-[#F4B942]">FUTURE READY → BUILD6™</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Real student experience → lessons learned → a stronger, structured
                      six-stage career-readiness system.
                    </p>
                  </div>
                  <p className="mt-7 text-lg font-black">Real student. Real internship. Real-world growth.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    This interview documents a student&apos;s experience in the earlier Future
                    Ready internship model. It is presented as part of the history and
                    evidence that informed BUILD6™, not as a claim that the student completed
                    the current BUILD6™ program.
                  </p>
                </div>

                <div className="bg-black p-3 md:p-5">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <video
                      className="aspect-video w-full bg-black"
                      controls
                      preload="metadata"
                      poster="/media/future-ready-intern-interview-poster.jpg"
                    >
                      <source src="/media/future-ready-intern-interview-web.mp4" type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  </div>
                  <div className="px-2 pb-2 pt-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#66C2C6]">Student Story • Lake Norman, North Carolina</p>
                    <h3 className="mt-2 text-xl font-black">A Student&apos;s Story: From Future Ready to the Foundation of BUILD6™</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Hear directly from a student who participated in the original Future Ready internship experience.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12 rounded-[28px] border border-[#F4B942]/40 bg-[#FFF9E8] p-8 md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0B3B60]">Built From Practice, Not Theory</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black text-[#0B3B60]">
                The interview is one story. The proof system should keep growing.
              </h2>
              <p className="mt-4 max-w-4xl leading-7 text-slate-700">
                BUILD6™ can document student reflections, employer and mentor feedback,
                completed projects, readiness growth, internships, job shadows, presentations,
                and next-step outcomes—turning individual experiences into a visible record of impact.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link href="/programs/ambassador" className="rounded-xl bg-[#0B3B60] px-6 py-3 font-black text-white transition hover:brightness-110">
                  Explore the Program
                </Link>
                <Link href="/licensing" className="rounded-xl border border-[#0B3B60] px-6 py-3 font-black text-[#0B3B60] transition hover:bg-white">
                  Explore Licensing
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
