import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import {
  generateCareerPathways,
  type StudentCareerProfile,
} from "@/content/career-intelligence";
import CareerSaveButton from "./CareerSaveButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function splitProfileValue(
  value: string | null | undefined
): string[] {
  if (!value) return [];

  return value
    .split(/[,;\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function CareerPathwaysPage({
  params,
}: PageProps) {
  const { id } = await params;

  const authorization =
    await authorizeStudentAccess(id);

  if (!authorization.allowed) {
    notFound();
  }

  const student =
    await prisma.student.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        careerSummary: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            displayName: true,
          },
        },
        profile: {
          select: {
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
        },
        careerInterests: {
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            careerName: true,
            industry: true,
            interest: true,
            notes: true,
          },
        },
      },
    });

  if (!student) {
    notFound();
  }

  const strengths =
    splitProfileValue(
      student.profile?.strengths
    );

  const interests =
    splitProfileValue(
      student.profile?.careerInterests
    );

  const goals =
    splitProfileValue(
      student.profile?.futureGoals
    );

  const skills = student.studentSkills.map(
    (studentSkill) =>
      studentSkill.skill.name
  );

  const profile: StudentCareerProfile = {
    studentId: student.id,
    strengths:
      strengths.length > 0
        ? strengths
        : skills,
    interests: [
      ...interests,
      ...goals,
    ],
    industries: interests,
  };

  const pathways =
    generateCareerPathways(profile);

  const savedCareerNames = new Set(
    student.careerInterests.map(
      (career) =>
        career.careerName.toLowerCase()
    )
  );

  const studentName =
    student.user.displayName ??
    `${student.user.firstName} ${student.user.lastName}`.trim();

  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
          Future Ready™ Career Intelligence
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {studentName}&apos;s Opportunity Map
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Explore careers connected to your
          strengths, interests, skills, and
          future goals. These are opportunities
          to investigate — not limits on what
          you can become.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          My Career Profile
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          What Future Ready™ Is Learning
          About Me
        </h2>

        {strengths.length > 0 ? (
          <div className="mt-6">
            <p className="font-black text-slate-700">
              Strengths
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {strengths.map((strength) => (
                <span
                  key={strength}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {interests.length > 0 ? (
          <div className="mt-6">
            <p className="font-black text-slate-700">
              Career Interests
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-[#FFF3BF] px-4 py-2 text-sm font-bold text-[#725500]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {strengths.length === 0 &&
        interests.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-[#FFF9DF] p-5">
            <p className="font-black text-[#0D1B3D]">
              Your Opportunity Map will get
              smarter as you build your profile.
            </p>

            <p className="mt-2 leading-7 text-slate-600">
              Add your strengths, interests,
              values, and goals so Future Ready™
              can connect your profile to more
              relevant career ideas.
            </p>

            <Link
              href={`/ambassador/student-portal/${student.id}/profile`}
              className="mt-4 inline-block rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
            >
              Build My Profile →
            </Link>
          </div>
        ) : null}
      </section>

      {student.careerInterests.length > 0 ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            Saved Career Interests
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Careers I Want to Explore
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {student.careerInterests.map(
              (career) => (
                <div
                  key={career.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <p className="font-black text-[#0D1B3D]">
                    {career.careerName}
                  </p>

                  {career.industry ? (
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {career.industry}
                    </p>
                  ) : null}
                </div>
              )
            )}
          </div>

          <p className="mt-5 text-sm font-bold text-emerald-800">
            ✓ These interests are saved to your
            Future Ready™ student record.
          </p>
        </section>
      ) : null}

      <section>
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Career Ideas
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Careers to Explore
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Read what each career actually
            involves. If something catches your
            attention, save it so you can come
            back to it as you continue building
            your Future Ready™ Passport.
          </p>
        </div>

        <div className="space-y-6">
          {pathways.map((pathway) => {
            const initiallySaved =
              savedCareerNames.has(
                pathway.title.toLowerCase()
              );

            return (
              <article
                key={pathway.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <p className="text-sm font-black uppercase tracking-[0.15em] text-[#B88600]">
                  {pathway.industry}
                </p>

                <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
                  {pathway.title}
                </h2>

                <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                  <h3 className="font-black text-[#0D1B3D]">
                    What Does This Career Do?
                  </h3>

                  <p className="mt-2 leading-7 text-slate-700">
                    {pathway.description}
                  </p>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  <CareerList
                    title="Why This Might Fit You"
                    items={pathway.whyItFits}
                  />

                  <CareerList
                    title="Skills to Develop"
                    items={
                      pathway.skillsToDevelop
                    }
                  />

                  <CareerList
                    title="Experiences to Try"
                    items={
                      pathway.experiencesToTry
                    }
                  />
                </div>

                <div className="mt-7 border-t border-slate-200 pt-6">
                  <CareerSaveButton
                    studentId={student.id}
                    careerName={pathway.title}
                    industry={pathway.industry}
                    description={
                      pathway.description
                    }
                    initiallySaved={
                      initiallySaved
                    }
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-[#FFF9DF] p-7">
        <h2 className="text-2xl font-black text-[#0D1B3D]">
          Career exploration is not about
          choosing your entire future today.
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-slate-700">
          Your job is to explore. Save careers
          that make you curious, learn what the
          work actually looks like, talk with
          people doing that work, and keep
          building evidence about what fits you.
          Your interests may change as you gain
          new experiences — that is part of
          becoming Future Ready™.
        </p>
      </section>

      <nav className="flex flex-wrap gap-3">
        <Link
          href={`/ambassador/student-portal/${student.id}`}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700"
        >
          ← My Dashboard
        </Link>

        <Link
          href={`/ambassador/student-passport/${student.id}`}
          className="rounded-xl bg-[#0D1B3D] px-5 py-3 font-black text-white"
        >
          My Passport →
        </Link>
      </nav>
    </main>
  );
}

function CareerList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="font-black text-[#0D1B3D]">
        {title}
      </h3>

      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 leading-6 text-slate-600"
          >
            <span className="font-black text-[#F2B705]">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
