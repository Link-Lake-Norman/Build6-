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

type StoryEntry = {
  id: string;
  weekNumber: number | null;
  dayNumber: number | null;
  learning: string;
  skillEvidence: string;
  growth: string;
  status: string;
  updatedAt: Date;
};

function parseCapstoneResponse(response: string) {
  const values = {
    learning: "",
    skillEvidence: "",
    growth: "",
  };

  const sections = response.split("\n\n");

  for (const section of sections) {
    if (section.startsWith("Learning / Idea:\n")) {
      values.learning = section.replace("Learning / Idea:\n", "").trim();
    }

    if (section.startsWith("Skill Evidence:\n")) {
      values.skillEvidence = section.replace("Skill Evidence:\n", "").trim();
    }

    if (section.startsWith("Vision / Goal / Next Step:\n")) {
      values.growth = section
        .replace("Vision / Goal / Next Step:\n", "")
        .trim();
    }
  }

  return values;
}

function parsePrompt(prompt: string) {
  const match = prompt.match(/^Capstone Build · Week (\d+) · Day (\d+)$/);

  if (!match) {
    return {
      weekNumber: null,
      dayNumber: null,
    };
  }

  return {
    weekNumber: Number(match[1]),
    dayNumber: Number(match[2]),
  };
}

function cleanProfileValue(value?: string | null) {
  return value?.trim() ?? "";
}

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

      profile: {
        select: {
          aboutMe: true,
          strengths: true,
          values: true,
          careerInterests: true,
          futureGoals: true,
          skillsToBuild: true,
        },
      },

      reflections: {
        where: {
          prompt: {
            startsWith: "Capstone Build · Week ",
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          prompt: true,
          response: true,
          status: true,
          updatedAt: true,
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

  const storyEntries: StoryEntry[] = student.reflections.map((reflection) => {
    const location = parsePrompt(reflection.prompt);
    const values = parseCapstoneResponse(reflection.response);

    return {
      id: reflection.id,
      weekNumber: location.weekNumber,
      dayNumber: location.dayNumber,
      learning: values.learning,
      skillEvidence: values.skillEvidence,
      growth: values.growth,
      status: reflection.status,
      updatedAt: reflection.updatedAt,
    };
  });

  const completedStoryEntries = storyEntries.filter(
    (entry) => entry.learning && entry.skillEvidence && entry.growth,
  );

  const profileThreads = [
    {
      label: "About Me",
      value: cleanProfileValue(student.profile?.aboutMe),
    },
    {
      label: "Strengths",
      value: cleanProfileValue(student.profile?.strengths),
    },
    {
      label: "Values",
      value: cleanProfileValue(student.profile?.values),
    },
    {
      label: "Interests",
      value: cleanProfileValue(student.profile?.careerInterests),
    },
    {
      label: "Goals",
      value: cleanProfileValue(student.profile?.futureGoals),
    },
    {
      label: "Skills I Want to Build",
      value: cleanProfileValue(student.profile?.skillsToBuild),
    },
  ].filter((item) => item.value);

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
          This is not another assignment. This is your book about you — what
          matters to you, what you are good at, who has shaped you, what you are
          learning, and the kind of person and life you want to build.
        </p>

        <div className="mt-7 rounded-2xl border border-white/20 bg-white/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
            THE QUESTION WE ARE BUILDING TOWARD
          </p>

          <p className="mt-2 text-2xl font-black">“I am…”</p>

          <p className="mt-3 max-w-3xl leading-7 text-slate-200">
            By the end, you should be able to explain who you are beyond a
            sport, title, grade, or label — what you bring, what matters to you,
            who has influenced you, what you have learned, and where you want to
            go.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              MY STORY SO FAR
            </p>

            <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
              Look What You Are Already Learning About Yourself
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              You do not have to remember everything. Your reflections, profile,
              experiences, and ideas are building your book as you go.
            </p>
          </div>

          <div className="rounded-2xl bg-[#FFF9DF] px-5 py-3 text-center">
            <div className="text-2xl font-black text-[#0D1B3D]">
              {completedStoryEntries.length}
            </div>

            <div className="text-xs font-black uppercase tracking-[0.12em] text-[#725500]">
              Story Pieces Saved
            </div>
          </div>
        </div>

        {profileThreads.length > 0 ? (
          <div className="mt-6">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
              THINGS I ALREADY KNOW ABOUT MYSELF
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {profileThreads.map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.12em] text-[#4B2265]">
                    {item.label}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
              MOMENTS I AM COLLECTING
            </p>

            <Link
              href={`/ambassador/student-passport/${student.id}/reflections`}
              className="text-xs font-black text-[#0D1B3D]"
            >
              See All My Reflections →
            </Link>
          </div>

          {storyEntries.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <p className="font-black text-[#0D1B3D]">
                Your story will start appearing here as you complete class
                reflections.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                You do not need to create everything at once. One honest thought
                at a time is enough.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-4">
              {storyEntries.slice(0, 6).map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#4B2265]">
                      {entry.weekNumber
                        ? `Week ${entry.weekNumber}`
                        : "My Story"}
                      {entry.dayNumber ? ` · Day ${entry.dayNumber}` : ""}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${
                        entry.status === "SUBMITTED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {entry.status === "SUBMITTED"
                        ? "Complete"
                        : "Still Growing"}
                    </span>
                  </div>

                  {entry.learning ? (
                    <StoryPiece
                      label="What Stayed With Me"
                      value={entry.learning}
                    />
                  ) : null}

                  {entry.skillEvidence ? (
                    <StoryPiece
                      label="What I Showed"
                      value={entry.skillEvidence}
                    />
                  ) : null}

                  {entry.growth ? (
                    <StoryPiece
                      label="What This Says About Me"
                      value={entry.growth}
                    />
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          ONE SIMPLE PATH
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Experience → Notice → Keep What Matters
        </h2>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-black text-[#0D1B3D]">1 · Experience</p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Learn, meet people, try things, listen, lead, struggle, succeed,
              and live your life.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-black text-[#0D1B3D]">2 · Notice</p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Pay attention to what shows you something about your strengths,
              values, interests, people, goals, or growth.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-black text-[#0D1B3D]">3 · Keep It</p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Save the thoughts, words, quotes, people, experiences, and
              evidence that help you explain who you are.
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-xl bg-[#EAFBFB] p-4 text-sm font-bold leading-6 text-[#0D1B3D]">
          Stuck while writing? Use the <strong>Help me think</strong> tools
          inside your class reflections. They will help you find words and think
          deeper without writing your story for you.
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
          These chapters are not a checklist. Lessons, mentors, coaches,
          speakers, experiences, friendships, challenges, accomplishments,
          interests, goals, quotes, places, and opportunities will give you
          pieces for them over time.
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
          KEEP GOING
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          Your Story Will Keep Changing
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-slate-600">
          You are allowed to change your mind. Your goals may change. New people
          may influence you. You may discover strengths, interests, passions, or
          possibilities you do not know about yet. That is part of the point.
        </p>

        <p className="mt-4 max-w-4xl font-bold leading-7 text-[#0D1B3D]">
          This book is not about having your whole life figured out. It is about
          learning how to know yourself well enough to keep moving forward.
        </p>
      </section>
    </main>
  );
}

function StoryPiece({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}
