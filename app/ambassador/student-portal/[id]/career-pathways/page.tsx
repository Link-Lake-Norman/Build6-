import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { authorizeStudentAccess } from "@/lib/auth/student-access";
import {
  generateCareerPathways,
  generateDiscoveryCareers,
  type StudentCareerProfile,
} from "@/content/career-intelligence";
import CareerSaveButton from "./CareerSaveButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function splitProfileValue(value: string | null | undefined): string[] {
  if (!value) return [];

  return value
    .split(/[,;\n|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function CareerPathwaysPage({ params }: PageProps) {
  const { id } = await params;

  const authorization = await authorizeStudentAccess(id);

  if (!authorization.allowed) {
    notFound();
  }

  const student = await prisma.student.findUnique({
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
      readinessProfile: {
        select: {
          completedAt: true,
          selfAwareness: true,
          communication: true,
          leadership: true,
          professionalPresence: true,
          careerReadiness: true,
          adaptability: true,
          aiReadiness: true,
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

  const strengths = splitProfileValue(student.profile?.strengths);

  const interests = splitProfileValue(student.profile?.careerInterests);

  const goals = splitProfileValue(student.profile?.futureGoals);

  const values = splitProfileValue(student.profile?.values);

  const skillsToBuild = splitProfileValue(student.profile?.skillsToBuild);

  const careerSummarySignals = splitProfileValue(student.careerSummary);

  const skills = student.studentSkills.map(
    (studentSkill) => studentSkill.skill.name,
  );

  const savedCareerSignals = student.careerInterests.flatMap((career) =>
    [career.careerName, career.industry].filter((item): item is string =>
      Boolean(item),
    ),
  );

  const unique = (items: string[]) =>
    Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

  const profile: StudentCareerProfile = {
    studentId: student.id,
    strengths: unique([...strengths, ...skills, ...values]),
    interests: unique([
      ...interests,
      ...goals,
      ...values,
      ...skillsToBuild,
      ...savedCareerSignals,
      ...careerSummarySignals,
    ]),
    industries: unique([
      ...interests,
      ...student.careerInterests
        .map((career) => career.industry)
        .filter((item): item is string => Boolean(item)),
    ]),
  };

  const generatedPathways = generateCareerPathways(profile);
  const discoveryCareers = generateDiscoveryCareers(profile);

  const pathways =
    generatedPathways.length > 0
      ? generatedPathways
      : generateCareerPathways({
          ...profile,
          interests: [
            ...profile.interests,
            "business",
            "healthcare",
            "technology",
            "skilled trades",
            "government",
            "community",
          ],
          industries: [
            ...profile.industries,
            "business",
            "healthcare",
            "technology",
            "skilled trades",
          ],
        });

  const savedCareerNames = new Set(
    student.careerInterests.map((career) => career.careerName.toLowerCase()),
  );

  const studentName =
    student.user.displayName ??
    `${student.user.firstName} ${student.user.lastName}`.trim();

  return (
    <main className="space-y-8">
      <section className="rounded-3xl bg-[#0D1B3D] p-8 text-white shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#F2B705]">
          EXPLORE WHAT FITS ME
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {studentName}&apos;s Career + Opportunity Map
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
          Explore careers connected to your strengths, interests, skills, and
          future goals. These are opportunities to investigate — not limits on
          what you can become.
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
          What I Know About Myself
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
          What Is Learning About Me
        </h2>

        {strengths.length > 0 ? (
          <div className="mt-6">
            <p className="font-black text-slate-700">Strengths</p>

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
            <p className="font-black text-slate-700">Career Interests</p>

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

        {strengths.length === 0 && interests.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-[#FFF9DF] p-5">
            <p className="font-black text-[#0D1B3D]">
              Your Career + Opportunity Map will get smarter as you build your
              profile.
            </p>

            <p className="mt-2 leading-7 text-slate-600">
              Add your strengths, interests, values, and goals so can connect
              your profile to more relevant career ideas.
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
            {student.careerInterests.map((career) => (
              <div
                key={career.id}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <p className="font-black text-[#0D1B3D]">{career.careerName}</p>

                {career.industry ? (
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {career.industry}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm font-bold text-emerald-800">
            ✓ These interests are saved to your student record.
          </p>
        </section>
      ) : null}

      <section>
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B2265]">
            Ideas Worth Exploring
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
            Careers + Opportunities to Explore
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Read what each career actually involves. If something catches your
            attention, save it so you can come back to it as you continue
            building your Passport.
          </p>
        </div>

        <div className="mb-5 rounded-2xl border border-[#00A6A6]/25 bg-[#EAFBFB] p-5">
          <p className="font-black text-[#0D1B3D]">
            These are starting points, not answers.
          </p>
          <p className="mt-2 leading-7 text-slate-600">
            Your recommendations grow as you complete assessments, reflect,
            identify strengths and values, build skills, save interests, and
            gain real experiences. Explore broadly and pay attention to what
            makes you curious.
          </p>
        </div>

        <div className="space-y-6">
          {pathways.map((pathway) => {
            const initiallySaved = savedCareerNames.has(
              pathway.title.toLowerCase(),
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
                    title="Why It May Fit Me"
                    items={pathway.whyItFits}
                  />

                  <CareerList
                    title="Skills I Can Build"
                    items={pathway.skillsToDevelop}
                  />

                  <CareerList
                    title="Ways I Can Test It"
                    items={pathway.experiencesToTry}
                  />
                </div>

                <div className="mt-7 border-t border-slate-200 pt-6">
                  <CareerSaveButton
                    studentId={student.id}
                    careerName={pathway.title}
                    industry={pathway.industry}
                    description={pathway.description}
                    initiallySaved={initiallySaved}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {student.readinessProfile?.completedAt ? (
        <section className="rounded-3xl border border-teal-200 bg-teal-50 p-7">
          <h2 className="text-2xl font-black text-[#0D1B3D]">Your Assessment → Career Exploration</h2>
          <p className="mt-3 leading-7 text-slate-700">Your completed readiness assessment helps identify areas to practice as you explore these careers. Your actual career interests, strengths, values, goals and saved experiences inform the career suggestions above. A readiness score does not determine what career you should pursue.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {([
              ["Self-awareness", student.readinessProfile.selfAwareness],
              ["Communication", student.readinessProfile.communication],
              ["Leadership", student.readinessProfile.leadership],
              ["Professional presence", student.readinessProfile.professionalPresence],
              ["Career readiness", student.readinessProfile.careerReadiness],
              ["Adaptability", student.readinessProfile.adaptability],
              ["AI readiness", student.readinessProfile.aiReadiness],
            ] as const).map(([label, value]) => (
              <div key={label} className="rounded-xl border border-teal-100 bg-white p-4">
                <p className="font-bold text-[#0D1B3D]">{label}</p>
                <p className="mt-1 text-sm text-slate-600">Baseline: {Number(value).toFixed(1)} / 5 · Growth opportunity, not career eligibility</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">Discuss which suggested careers connect to your values and interests, which less-familiar roles you want to investigate, and what education, training or work experience each requires. Save the careers that interest you.</p>
        </section>
      ) : (
        <section className="rounded-3xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-black text-[#0D1B3D]">Connect your assessment</h2>
          <p className="mt-2 text-slate-700">Complete your existing readiness assessment to add your baseline and growth priorities to this Career + Opportunity Map.</p>
          <Link href={`/ambassador/student-portal/${student.id}/assessment`} className="mt-4 inline-block rounded-xl bg-[#0D1B3D] px-5 py-3 font-bold text-white">Open My Assessment →</Link>
        </section>
      )}

      <section className="rounded-3xl border-2 border-teal-200 bg-white p-7">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">Explore beyond the familiar</p>
        <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">Six less-familiar careers to investigate</h2>
        <p className="mt-3 max-w-4xl leading-7 text-slate-700">These six exploratory suggestions use your saved strengths, interests, values, goals and career signals. They are starting points, not eligibility decisions. Education and training routes are common examples; check the current requirements of any school, employer or licensing body.</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {discoveryCareers.map((career) => (
            <article key={career.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-bold text-teal-700">{career.industry}</p>
              <h3 className="mt-1 text-2xl font-black text-[#0D1B3D]">{career.title}</h3>
              <p className="mt-3 leading-7 text-slate-700">{career.description}</p>
              <div className="mt-4 grid gap-4">
                <CareerList title="Why explore this" items={career.whyItFits} />
                <CareerList title="Skills to build" items={career.skillsToDevelop} />
                <CareerList title="Ways to test it" items={career.experiencesToTry} />
                <CareerList title="Education and training routes to research" items={career.educationRoutes} />
              </div>
              <div className="mt-5 border-t border-slate-200 pt-4">
                <CareerSaveButton studentId={student.id} careerName={career.title} industry={career.industry} description={career.description} initiallySaved={savedCareerNames.has(career.title.toLowerCase())} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-[#FFF9DF] p-7">
        <h2 className="text-2xl font-black text-[#0D1B3D]">
          Career exploration is not about choosing your entire future today.
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-slate-700">
          Your job is to explore. Save careers that make you curious, learn what
          the work actually looks like, talk with people doing that work, and
          keep building evidence about what fits you. Your interests may change
          as you gain new experiences — that is part of building what comes
          next.
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

function CareerList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-black text-[#0D1B3D]">{title}</h3>

      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 leading-6 text-slate-600">
            <span className="font-black text-[#F2B705]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
