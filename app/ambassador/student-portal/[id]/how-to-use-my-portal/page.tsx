import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const steps = [
  {
    number: "1",
    title: "Start on My Dashboard",
    text: "Your dashboard shows what is open, what needs attention, and the fastest path back to your work.",
  },
  {
    number: "2",
    title: "Check Missing Work",
    text: "Red ✕ means required work is not complete. Open the item and finish it before you log out.",
  },
  {
    number: "3",
    title: "Open the Correct Week and Day",
    text: "Assignments are grouped by Week and Day. Use COMPLETE NOW to go directly to the work that is missing.",
  },
  {
    number: "4",
    title: "Save Draft Is Not Submit",
    text: "Save Draft protects your progress. It does not finish the assignment and it will remain red.",
  },
  {
    number: "5",
    title: "Press Submit Assignment",
    text: "When you are finished, press SUBMIT. Do not leave the assignment until you see the green ✓ SUBMITTED status.",
  },
  {
    number: "6",
    title: "Check Again Before Logging Out",
    text: "Return to My Work Status. If you still see a red ✕, you still have something to finish.",
  },
  {
    number: "7",
    title: "Know the Weekly Accountability Rule",
    text: "If required work is incomplete Friday at 8:00 AM, you receive an email reminder. If work from that reminder is still incomplete the following Monday, 30 participation points are deducted.",
  },
];

export default async function HowToUseMyPortalPage({ params }: PageProps) {
  const { id } = await params;
  const access = await authorizeStudentAccess(id);

  if (!access.allowed) {
    if (access.status === 401) {
      redirect("/ambassador/login");
    }

    if (access.status === 404) {
      notFound();
    }

    redirect("/ambassador");
  }

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          START HERE
        </p>
        <h1 className="mt-3 text-4xl font-black">
          How to Use & Navigate My Portal
        </h1>
        <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-200">
          Your portal is built to show you exactly what to do. Follow the status
          marks, use the direct links, and submit every required assignment.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatusCard
          symbol="✕"
          title="RED = NOT COMPLETE"
          text="No submission, a saved draft, rejected work, or work needing revision."
          className="border-red-200 bg-red-50 text-red-700"
        />
        <StatusCard
          symbol="✓"
          title="GREEN = SUBMITTED"
          text="Your required assignment has been submitted or approved."
          className="border-emerald-200 bg-emerald-50 text-emerald-700"
        />
        <StatusCard
          symbol="○"
          title="GRAY = NO ACTION"
          text="No required assignment is attached, or the work is not available yet."
          className="border-slate-200 bg-slate-50 text-slate-600"
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-black text-[#0D1B3D]">
          My Portal Routine
        </h2>

        <div className="mt-5 grid gap-4">
          {steps.map((step) => (
            <article
              key={step.number}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0D1B3D] text-sm font-black text-white">
                {step.number}
              </div>
              <div>
                <h3 className="font-black text-[#0D1B3D]">{step.title}</h3>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
          WHERE EVERYTHING LIVES
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Know where to go before you say you cannot find it.
        </h2>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
          Your Dashboard is home base. Assignments is where required work is completed
          and submitted. Your Student Passport keeps your progress, reflections, evidence,
          and accomplishments together. My Capstone is your ongoing story built from what
          you learn, experience, notice, and save throughout the program.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Link
            href={`/ambassador/student-portal/${id}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0D1B3D]"
          >
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              HOME BASE
            </p>
            <h3 className="mt-1 font-black text-[#0D1B3D]">My Dashboard</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Start here. Check Missing Work first, then open the week, assignment,
              message, or portal area you need.
            </p>
          </Link>

          <Link
            href={`/ambassador/student-portal/${id}/assignments`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0D1B3D]"
          >
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              REQUIRED WORK
            </p>
            <h3 className="mt-1 font-black text-[#0D1B3D]">Assignments</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Red means you still owe work. Save Draft is not complete. Press SUBMIT
              and confirm the assignment turns green.
            </p>
          </Link>

          <Link
            href={`/ambassador/student-passport/${id}`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0D1B3D]"
          >
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              MY RECORD
            </p>
            <h3 className="mt-1 font-black text-[#0D1B3D]">Student Passport</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Use your Passport to review your progress, reflections, portfolio evidence,
              accomplishments, and the record you are building through the program.
            </p>
          </Link>

          <Link
            href={`/ambassador/student-portal/${id}/capstone`}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#0D1B3D]"
          >
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              MY STORY
            </p>
            <h3 className="mt-1 font-black text-[#0D1B3D]">My Capstone</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Your Capstone grows as you go. Reflections, experiences, ideas, evidence,
              growth, and lessons learned become the story you will carry forward.
            </p>
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
          BEFORE YOU LOG OUT
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          No red ✕ should be left unexplained.
        </h2>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-700">
          Go to Assignments, review every released Week and Day, and finish
          anything marked red. If you believe something is wrong, contact your
          facilitator before the deadline rather than assuming it is complete.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/ambassador/student-portal/${id}`}
          className="rounded-xl border border-[#0D1B3D] bg-white px-5 py-3 font-black text-[#0D1B3D]"
        >
          ← My Dashboard
        </Link>
        <Link
          href={`/ambassador/student-portal/${id}/assignments`}
          className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
        >
          Check My Work →
        </Link>
        <Link
          href={`/ambassador/student-passport/${id}`}
          className="rounded-xl border border-[#4B2265] bg-white px-5 py-3 font-black text-[#4B2265]"
        >
          Open My Passport →
        </Link>
        <Link
          href={`/ambassador/student-portal/${id}/capstone`}
          className="rounded-xl border border-[#F2B705] bg-[#FFF9DF] px-5 py-3 font-black text-[#725500]"
        >
          Open My Capstone →
        </Link>
      </div>
    </main>
  );
}

function StatusCard({
  symbol,
  title,
  text,
  className,
}: {
  symbol: string;
  title: string;
  text: string;
  className: string;
}) {
  return (
    <article className={`rounded-2xl border p-5 ${className}`}>
      <p className="text-3xl font-black">{symbol}</p>
      <h2 className="mt-2 font-black">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6">{text}</p>
    </article>
  );
}
