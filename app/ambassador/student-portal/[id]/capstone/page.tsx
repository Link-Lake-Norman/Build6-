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
          href={`/ambassador/student-portal/${student.id}`}
          className="font-black text-[#0D1B3D]"
        >
          ← Back to My Dashboard
        </Link>

        <Link
          href={`/ambassador/student-passport/${student.id}/portfolio`}
          className="rounded-xl border border-[#0D1B3D] px-4 py-2 text-sm font-black text-[#0D1B3D]"
        >
          My Evidence · {evidenceCount}
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl bg-[#0D1B3D] p-7 text-white md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          FUTURE READY™ GRADUATION PROJECT
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          {futureReadyCapstone.title}
        </h1>

        <p className="mt-2 text-xl font-bold text-slate-200">
          {futureReadyCapstone.subtitle}
        </p>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-200">
          {futureReadyCapstone.purpose}
        </p>

        <div className="mt-7 rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
            THE QUESTION YOU WILL KEEP COMING BACK TO
          </p>

          <p className="mt-2 text-2xl font-black">
            {futureReadyCapstone.essentialQuestion}
          </p>
        </div>

        <p className="mt-6 font-bold text-white">
          {futureReadyCapstone.promise}
        </p>
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

      <CapstoneBrainMap studentId={student.id} />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          HOW THIS WORKS
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Your Capstone Grows With You
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
              "Use those pieces to build the graduation reflection book only you can create.",
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
