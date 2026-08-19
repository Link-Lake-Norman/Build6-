import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import CapstoneBrainMap from "@/components/ambassador/capstone/CapstoneBrainMap";
import CapstoneChapterGrid from "@/components/ambassador/capstone/CapstoneChapterGrid";
import { futureReadyCapstone } from "@/content/ambassador/capstone";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { authorizeStudentAccess } from "@/lib/auth/student-access";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentCapstonePage({ params }: PageProps) {
  const { id } = await params;

  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  const access = await authorizeStudentAccess(id);

  if (!access.allowed) {
    redirect("/ambassador");
  }

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          displayName: true,
        },
      },
      portfolio: {
        select: {
          id: true,
          _count: {
            select: {
              artifacts: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  const studentName =
    student.user.displayName ||
    `${student.user.firstName} ${student.user.lastName}`.trim() ||
    "Student";

  const evidenceCount = student.portfolio?._count.artifacts ?? 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={
            session.role === "STUDENT"
              ? `/ambassador/student-portal/${student.id}`
              : `/ambassador/student-passport/${student.id}`
          }
          className="font-black text-[#0D1B3D]"
        >
          {session.role === "STUDENT"
            ? "← Back to My Dashboard"
            : "← Back to Student Passport"}
        </Link>

        <Link
          href={`/ambassador/student-passport/${student.id}/portfolio`}
          className="rounded-xl border border-[#0D1B3D] px-4 py-2 text-sm font-black text-[#0D1B3D]"
        >
          {session.role === "STUDENT" ? "My Evidence" : "Student Evidence"} ·{" "}
          {evidenceCount}
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl bg-[#0D1B3D] p-7 text-white md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          MY CAPSTONE · MY STORY
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          Who Am I Becoming?
        </h1>

        <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">
          This is not another assignment. It is the story you will build from
          everything you learn about yourself: your strengths, skills, values,
          attributes, experiences, opportunities, goals, maturity, choices,
          challenges, relationships, and vision for what comes next.
        </p>

        <div className="mt-7 rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
            THE QUESTION WE ARE BUILDING TOWARD
          </p>

          <p className="mt-2 text-2xl font-black">“I am…”</p>

          <p className="mt-3 max-w-3xl leading-7 text-slate-200">
            By the end, you should be able to explain who you are beyond a
            sport, title, grade, or label — what you bring, what matters to you,
            what you have learned, and where you want to go.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          ONE SIMPLE PATH
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Reflect → Notice → Build Your Story
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-black text-[#0D1B3D]">1 · Reflect</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              What happened and what did you learn?
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-black text-[#0D1B3D]">2 · Notice</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              What does it reveal about your skills, values, strengths, choices,
              interests, or growth?
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-black text-[#0D1B3D]">3 · Build</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep the pieces that help you explain: “I am…”
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/ai-coach"
            className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white"
          >
            Help Me Think Deeper
          </Link>

          <Link
            href={`/ambassador/student-passport/${student.id}/reflections`}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-[#0D1B3D]"
          >
            See My Reflections
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          {studentName.toUpperCase()} · MY BOOK
        </p>

        <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
          The Story You Are Building
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-slate-600">
          These chapters are not a checklist you finish in one sitting. Future
          Ready™ lessons, reflections, speakers, experiences, career
          exploration, Life Economy decisions, accomplishments, challenges, and
          real-world opportunities will give you material for them throughout
          the program.
        </p>

        <div className="mt-6">
          <CapstoneChapterGrid />
        </div>
      </section>

      <CapstoneBrainMap
        studentId={student.id}
        readOnly={session.role !== "STUDENT"}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          HOW THIS WORKS
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Your Story Grows With You
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            [
              "1",
              "EXPERIENCE IT",
              "Participate in lessons, conversations, speakers, projects, field trips, work experiences, and life.",
            ],
            [
              "2",
              "NOTICE IT",
              "Pay attention to what teaches you something about yourself, your skills, or your future.",
            ],
            [
              "3",
              "SAVE IT",
              "Preserve meaningful evidence, images, writing, reflections, documents, and ideas.",
            ],
            [
              "4",
              "TELL YOUR STORY",
              "Use those pieces to build an authentic story only you can tell.",
            ],
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="text-2xl font-black text-[#F2B705]">{number}</div>

              <div className="mt-2 text-sm font-black text-[#0D1B3D]">
                {title}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
