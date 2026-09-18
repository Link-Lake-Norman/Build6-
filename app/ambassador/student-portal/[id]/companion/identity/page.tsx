import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { authorizeStudentAccess } from "@/lib/auth/student-access";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type IdentityItem = {
  label: string;
  value: string;
  prompt: string;
};

function clean(value?: string | null) {
  return value?.trim() ?? "";
}

function IdentityCard({ item }: { item: IdentityItem }) {
  const hasValue = Boolean(item.value);

  return (
    <article
      className={
        hasValue
          ? "rounded-2xl border border-[#4B2265]/20 bg-white p-5 shadow-sm"
          : "rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"
      }
    >
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#4B2265]">
        {item.label}
      </p>
      {hasValue ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
          {item.value}
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm font-black text-[#0D1B3D]">
            This part of your map is still open.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{item.prompt}</p>
        </>
      )}
    </article>
  );
}

export default async function Build6IdentityMapPage({ params }: PageProps) {
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

  const student = await prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      profileComplete: true,
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
      studentSkills: {
        select: {
          skill: {
            select: {
              name: true,
            },
          },
        },
        take: 8,
      },
      portfolio: {
        select: {
          _count: {
            select: {
              artifacts: true,
            },
          },
        },
      },
      reflections: {
        select: {
          id: true,
          status: true,
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

  const profile = student.profile;

  const items: IdentityItem[] = [
    {
      label: "Who I Am",
      value: clean(profile?.aboutMe),
      prompt: "What words, experiences, roles, or qualities help describe who you are right now?",
    },
    {
      label: "My Strengths",
      value: clean(profile?.strengths),
      prompt: "What do you do well? What do other people trust you to bring?",
    },
    {
      label: "What I Value",
      value: clean(profile?.values),
      prompt: "What matters enough to guide your choices, effort, relationships, and future?",
    },
    {
      label: "What Interests Me",
      value: clean(profile?.careerInterests),
      prompt: "What work, problems, industries, people, ideas, or experiences make you curious?",
    },
    {
      label: "Skills I Am Building",
      value: clean(profile?.skillsToBuild),
      prompt: "What skill, behavior, or professional habit are you intentionally strengthening?",
    },
    {
      label: "Where I Am Going",
      value: clean(profile?.futureGoals),
      prompt: "What future goal, direction, experience, or next step matters to you now?",
    },
  ];

  const completedFields = items.filter((item) => item.value).length;
  const evidenceCount = student.portfolio?._count.artifacts ?? 0;
  const reflectionCount = student.reflections.filter(
    (reflection) =>
      reflection.status === "SUBMITTED" || reflection.status === "APPROVED",
  ).length;

  const earnedSkills = student.studentSkills
    .map((studentSkill) => studentSkill.skill.name.trim())
    .filter(Boolean);

  return (
    <main className="space-y-6 pb-24">
      <section className="overflow-hidden rounded-[30px] bg-[#0D1B3D] text-white shadow-lg">
        <div className="p-7 md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F2B705]">
            BUILD6™ IDENTITY MAP
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Who I Am — and Who I Am Becoming
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200">
            {firstName}, this is your living identity map. It brings together the
            information you have already entered about your strengths, values,
            interests, skills, goals, and story. It can grow as you do.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-bold text-slate-300">Identity map</p>
              <p className="mt-1 text-2xl font-black">{completedFields}/6</p>
              <p className="mt-1 text-xs text-slate-300">areas with your words</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-bold text-slate-300">Story evidence</p>
              <p className="mt-1 text-2xl font-black">{evidenceCount}</p>
              <p className="mt-1 text-xs text-slate-300">portfolio artifacts</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-bold text-slate-300">Reflections</p>
              <p className="mt-1 text-2xl font-black">{reflectionCount}</p>
              <p className="mt-1 text-xs text-slate-300">
                submitted story pieces
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#F2B705]/50 bg-[#FFF9DF] p-6 md:p-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
          THIS IS YOUR MAP — NOT A NEW ASSIGNMENT
        </p>
        <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-[#0D1B3D]">
          BUILD6 is reading the profile information you already saved. Nothing
          was copied, reset, or rewritten to create this view. Update your words
          when your understanding of yourself changes.
        </p>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
              MY BUILD6 IDENTITY MAP
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#0D1B3D]">
              The Pieces That Help Tell My Story
            </h2>
          </div>
          <Link
            href={`/ambassador/student-portal/${student.id}/profile`}
            className="rounded-xl bg-[#0D1B3D] px-5 py-3 text-center text-sm font-black text-white"
          >
            EDIT MY IDENTITY MAP →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <IdentityCard key={item.label} item={item} />
          ))}
        </div>
      </section>

      {earnedSkills.length > 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4B2265]">
            SKILLS ALREADY SHOWING UP IN BUILD6
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {earnedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#EAFBFB] px-4 py-2 text-sm font-black text-[#0D1B3D]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/ambassador/student-portal/${student.id}/capstone`}
          className="rounded-3xl border-2 border-[#F2B705] bg-[#FFF9DF] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            MY STORY · MY CAPSTONE
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            See How My Identity Is Becoming My Story
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Carry strengths, values, interests, skills, experiences,
            reflections, challenges, goals, and evidence into your year-long
            Capstone.
          </p>
          <p className="mt-5 text-sm font-black text-[#0D1B3D]">
            OPEN MY CAPSTONE →
          </p>
        </Link>

        <Link
          href={`/ambassador/student-passport/${student.id}/portfolio`}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#4B2265]/40 hover:shadow-md"
        >
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            MY EVIDENCE
          </p>
          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Keep the Proof Behind the Story
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your experiences, work, artifacts, and proof help show where your
            strengths and skills came from.
          </p>
          <p className="mt-5 text-sm font-black text-[#4B2265]">
            OPEN MY EVIDENCE →
          </p>
        </Link>
      </section>

      <p className="px-2 text-center text-sm font-bold leading-6 text-slate-500">
        Your Identity Map is allowed to change. Growth is part of the map.
      </p>
    </main>
  );
}
