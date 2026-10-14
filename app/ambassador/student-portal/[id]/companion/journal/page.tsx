import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import Build6CompanionJournal from "@/components/student/Build6CompanionJournal";
import Build6CompanionEvidenceUpload from "@/components/student/Build6CompanionEvidenceUpload";
import Build6PaperReflectionUpload from "@/components/student/Build6PaperReflectionUpload";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const PREFIX = "BUILD6 Companion Journal · ";

function parseEntry(response: string) {
  const values = {
    moment: "",
    selfInsight: "",
    keepForStory: "",
  };

  for (const section of response.split("\n\n")) {
    if (section.startsWith("Moment / Thought:\n")) {
      values.moment = section
        .replace("Moment / Thought:\n", "")
        .trim();
    }

    if (section.startsWith("What I Noticed About Me:\n")) {
      values.selfInsight = section
        .replace("What I Noticed About Me:\n", "")
        .trim();
    }

    if (section.startsWith("Keep for My Story:\n")) {
      values.keepForStory = section
        .replace("Keep for My Story:\n", "")
        .trim();
    }
  }

  return values;
}

function displayDate(dateKey: string) {
  const value = new Date(`${dateKey}T12:00:00-04:00`);

  if (Number.isNaN(value.getTime())) {
    return dateKey;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(value);
}

export default async function Build6CompanionJournalPage({
  params,
}: PageProps) {
  const { id } = await params;
  const session = await getSessionUser();

  if (!session) {
    redirect("/ambassador/login");
  }

  if (session.role !== "STUDENT") {
    redirect("/ambassador");
  }

  const owner = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
    },
  });

  if (!owner) {
    notFound();
  }

  if (owner.userId !== session.id) {
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
          displayName: true,
        },
      },
      reflections: {
        where: {
          prompt: {
            startsWith: PREFIX,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 12,
        select: {
          id: true,
          prompt: true,
          response: true,
          status: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  const firstName =
    student.user.firstName ||
    student.user.displayName?.split(" ")[0] ||
    "Student";

  const entries = student.reflections.map((entry) => ({
    id: entry.id,
    dateKey: entry.prompt.replace(PREFIX, ""),
    ...parseEntry(entry.response),
    savedToStory: entry.status === "SUBMITTED",
    updatedAt: entry.updatedAt,
  }));

  return (
    <main className="space-y-6 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/ambassador/student-portal/${student.id}/companion`}
          className="font-black text-[#0D1B3D]"
        >
          ← Back to My Companion
        </Link>

        <Link
          href={`/ambassador/student-portal/${student.id}/capstone`}
          className="rounded-xl border border-[#0D1B3D] bg-white px-4 py-2 text-sm font-black text-[#0D1B3D]"
        >
          OPEN MY CAPSTONE →
        </Link>
      </div>

      <section className="rounded-3xl bg-[#0D1B3D] p-7 text-white shadow-sm md:p-9">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F2B705]">
          BUILD6™ · MY DAILY JOURNAL
        </p>

        <h1 className="mt-3 text-4xl font-black">
          Notice it. Capture it. Use it.
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-slate-200">
          Your future story is not created in one final assignment.
          It is built from the moments you notice along the way.
        </p>
      </section>

      <Build6CompanionJournal
        studentId={student.id}
        firstName={firstName}
      />

      <Build6CompanionEvidenceUpload studentId={student.id} />

        <Build6PaperReflectionUpload studentId={student.id} />

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              MY COMPANION VAULT
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
              Things I Chose to Keep
            </h2>
          </div>

          <p className="text-sm font-bold text-slate-500">
            {entries.length} recent entr{entries.length === 1 ? "y" : "ies"}
          </p>
        </div>

        {entries.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-[#0D1B3D]">
                    {displayDate(entry.dateKey)}
                  </p>

                  <span
                    className={
                      entry.savedToStory
                        ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800"
                        : "rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600"
                    }
                  >
                    {entry.savedToStory
                      ? "SAVED TO MY STORY"
                      : "PRIVATE DRAFT"}
                  </span>
                </div>

                {entry.moment ? (
                  <div className="mt-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
                      THE MOMENT
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {entry.moment}
                    </p>
                  </div>
                ) : null}

                {entry.selfInsight ? (
                  <div className="mt-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#4B2265]">
                      WHAT I NOTICED ABOUT ME
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {entry.selfInsight}
                    </p>
                  </div>
                ) : null}

                {entry.keepForStory ? (
                  <div className="mt-4 rounded-xl bg-[#FFF9DF] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
                      KEEP FOR MY STORY
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#0D1B3D]">
                      {entry.keepForStory}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="font-bold text-slate-600">
              Your Companion Vault starts with the first thing you decide is worth remembering.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
