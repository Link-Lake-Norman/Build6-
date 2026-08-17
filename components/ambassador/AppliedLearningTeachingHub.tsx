"use client";

import { useMemo, useState } from "react";

import { appliedLearningAssets } from "@/content/applied-learning";

import { getAmbassadorWeekDelivery } from "@/content/ambassador";

type Props = {
  week: number;
};

type RevealSection = "curveballs" | "consequences" | "answerGuide" | "athlete";

export default function AppliedLearningTeachingHub({ week }: Props) {
  const delivery = getAmbassadorWeekDelivery(week);

  const assetIds = useMemo(() => {
    if (!delivery) return [];

    const ids = new Set<string>();

    delivery.wednesday?.appliedLearningAssetIds?.forEach((id) => ids.add(id));

    delivery.thursday?.classroom?.appliedLearningAssetIds?.forEach((id) =>
      ids.add(id),
    );

    return Array.from(ids);
  }, [delivery]);

  const assets = useMemo(
    () =>
      assetIds
        .map((id) => appliedLearningAssets.find((asset) => asset.id === id))
        .filter((asset): asset is (typeof appliedLearningAssets)[number] =>
          Boolean(asset),
        ),
    [assetIds],
  );

  const [selectedId, setSelectedId] = useState<string>(assets[0]?.id ?? "");

  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const selected = assets.find((asset) => asset.id === selectedId) ?? assets[0];

  function toggle(section: RevealSection) {
    setRevealed((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  if (!delivery || assets.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#725500]">
            Applied Learning Lab
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#0D1B3D]">
            Week {week} · Practice It Before It Counts
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Students do not just talk about the skill. They make a decision,
            communicate it, experience the consequence and get another chance to
            respond professionally.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0D1B3D] px-5 py-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F2B705]">
            Hard Stop
          </p>

          <p className="mt-1 text-xl font-black">50 Minutes</p>

          <p className="mt-1 text-xs text-slate-300">
            Built for one Ambassador class period
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <TimingCard
          time="5 MIN"
          title="Set the Room"
          detail="Frame the situation. Do not teach the answer."
        />

        <TimingCard
          time="25 MIN"
          title="Run the Challenge"
          detail="Students decide, speak, role-play and respond."
        />

        <TimingCard
          time="12 MIN"
          title="Curveball + Retry"
          detail="Change the conditions and make them adapt."
        />

        <TimingCard
          time="8 MIN"
          title="Debrief"
          detail="Explain the reasoning and connect it to real life."
        />
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">
          Facilitator Rule
        </p>

        <p className="mt-2 text-sm font-semibold leading-6 text-amber-950">
          Do not give students the answer before the activity. Let them make the
          choice first. The learning happens when they have to explain the
          decision, see what their choice created and try again.
        </p>
      </div>

      {assets.length > 1 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Choose Today&apos;s Lab
          </p>

          <div className="flex flex-wrap gap-2">
            {assets.map((asset) => {
              const active = selected?.id === asset.id;

              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setSelectedId(asset.id)}
                  className={`rounded-full px-4 py-2 text-xs font-black transition ${
                    active
                      ? "bg-[#0D1B3D] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#0D1B3D]"
                  }`}
                >
                  {asset.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selected && (
        <div className="mt-7">
          <div className="rounded-3xl bg-slate-50 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Tag>{selected.format}</Tag>
                  <Tag>{selected.audience}</Tag>

                  {selected.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>

                <h3 className="mt-4 text-2xl font-black text-[#0D1B3D]">
                  {selected.title}
                </h3>

                <p className="mt-2 text-sm font-bold text-[#725500]">
                  {selected.lessonConnection}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <ContentCard title="WHY THIS MATTERS">
                <p>{selected.whyItMatters}</p>
              </ContentCard>

              <ContentCard title="THE SCENARIO">
                <p>{selected.scenario}</p>
              </ContentCard>
            </div>

            <div className="mt-5 rounded-2xl border-2 border-[#0D1B3D] bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
                Student Challenge
              </p>

              <ol className="mt-4 space-y-3">
                {selected.studentChallenge.map((challenge, index) => (
                  <li
                    key={`${selected.id}-challenge-${index}`}
                    className="flex gap-3 text-sm font-semibold leading-6 text-slate-700"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0D1B3D] text-xs font-black text-white">
                      {index + 1}
                    </span>

                    <span>{challenge}</span>
                  </li>
                ))}
              </ol>
            </div>

            {selected.roles && selected.roles.length > 0 && (
              <div className="mt-5">
                <SectionHeading>Assign the Room</SectionHeading>

                <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {selected.roles.map((role) => (
                    <div
                      key={role.role}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <p className="font-black text-[#0D1B3D]">{role.role}</p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {role.responsibility}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.professionalLanguage &&
              selected.professionalLanguage.length > 0 && (
                <div className="mt-6">
                  <SectionHeading>Professional Language Lab</SectionHeading>

                  <p className="mt-2 text-sm text-slate-600">
                    Students should practice saying the professional version out
                    loud — not just read it.
                  </p>

                  <div className="mt-4 space-y-3">
                    {selected.professionalLanguage.map((language, index) => (
                      <div
                        key={`${selected.id}-language-${index}`}
                        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                            Situation
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-700">
                            {language.situation}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-500">
                            Instead Of
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            “{language.insteadOf}”
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                            Try This
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            “{language.tryThis}”
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {selected.watchFor && selected.watchFor.length > 0 && (
              <div className="mt-6 rounded-2xl bg-[#FFF7D6] p-5">
                <SectionHeading>Coach Jones · Watch For</SectionHeading>

                <ul className="mt-3 space-y-2">
                  {selected.watchFor.map((item, index) => (
                    <li
                      key={`${selected.id}-watch-${index}`}
                      className="flex gap-2 text-sm font-semibold leading-6 text-slate-700"
                    >
                      <span>→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.curveballs && selected.curveballs.length > 0 && (
              <RevealCard
                title="⚡ DROP THE CURVEBALL"
                subtitle="Do not reveal this until students have made their first decision."
                open={Boolean(revealed.curveballs)}
                onToggle={() => toggle("curveballs")}
              >
                <ul className="space-y-3">
                  {selected.curveballs.map((curveball, index) => (
                    <li
                      key={`${selected.id}-curveball-${index}`}
                      className="rounded-xl bg-white p-4 text-sm font-bold leading-6 text-slate-700"
                    >
                      ⚡ {curveball}
                    </li>
                  ))}
                </ul>
              </RevealCard>
            )}

            {selected.consequenceReveal &&
              selected.consequenceReveal.length > 0 && (
                <RevealCard
                  title="WHAT DID THAT DECISION CREATE?"
                  subtitle="Reveal the consequence after the choice — not before."
                  open={Boolean(revealed.consequences)}
                  onToggle={() => toggle("consequences")}
                >
                  <ul className="space-y-3">
                    {selected.consequenceReveal.map((consequence, index) => (
                      <li
                        key={`${selected.id}-consequence-${index}`}
                        className="text-sm font-semibold leading-6 text-slate-700"
                      >
                        → {consequence}
                      </li>
                    ))}
                  </ul>
                </RevealCard>
              )}

            {selected.retryPrompt && (
              <div className="mt-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-800">
                  ↻ The Retry
                </p>

                <p className="mt-3 text-lg font-black leading-7 text-emerald-950">
                  {selected.retryPrompt}
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
                  Future Ready™ students get another rep. Improvement matters
                  more than getting the first answer perfect.
                </p>
              </div>
            )}

            <div className="mt-6">
              <SectionHeading>Debrief the Room</SectionHeading>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {selected.discussionQuestions.map((question, index) => (
                  <div
                    key={`${selected.id}-discussion-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <p className="text-xs font-black text-[#725500]">
                      QUESTION {index + 1}
                    </p>

                    <p className="mt-2 text-sm font-bold leading-6 text-[#0D1B3D]">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <RevealCard
              title="🔐 FACILITATOR ANSWER + REASONING GUIDE"
              subtitle="Open after students have defended their thinking."
              open={Boolean(revealed.answerGuide)}
              onToggle={() => toggle("answerGuide")}
            >
              <GuideSection
                title="Strong Responses"
                items={selected.facilitatorAnswerGuide.strongResponses}
              />

              <GuideSection
                title="Why"
                items={selected.facilitatorAnswerGuide.reasoning}
              />

              <GuideSection
                title="Coaching Points"
                items={selected.facilitatorAnswerGuide.coachingPoints}
              />
            </RevealCard>

            {selected.athleteExtension && (
              <RevealCard
                title="🏅 ATHLETE PATHWAY EXTENSION"
                subtitle="Use when the athlete-specific situation strengthens the lesson."
                open={Boolean(revealed.athlete)}
                onToggle={() => toggle("athlete")}
              >
                <p className="text-lg font-black text-[#0D1B3D]">
                  {selected.athleteExtension.title}
                </p>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                  {selected.athleteExtension.scenario}
                </p>

                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
                    What They Need to Consider
                  </p>

                  <ul className="mt-3 space-y-2">
                    {selected.athleteExtension.considerations.map(
                      (item, index) => (
                        <li
                          key={`${selected.id}-athlete-${index}`}
                          className="text-sm font-semibold leading-6 text-slate-700"
                        >
                          → {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </RevealCard>
            )}

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <ContentCard title="CLOSE THE LOOP">
                <div className="space-y-3">
                  {selected.reflectionPrompts.map((prompt, index) => (
                    <p
                      key={`${selected.id}-reflection-${index}`}
                      className="font-semibold"
                    >
                      {index + 1}. {prompt}
                    </p>
                  ))}
                </div>
              </ContentCard>

              {selected.portfolioEvidence && (
                <ContentCard title="FUTURE READY™ EVIDENCE">
                  <p className="font-bold text-[#0D1B3D]">
                    {selected.portfolioEvidence}
                  </p>

                  <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
                    This is not busywork. It becomes evidence of communication,
                    decision-making, leadership and professional readiness.
                  </p>
                </ContentCard>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-[#0D1B3D] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F2B705]">
                If Time Gets Tight
              </p>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">
                Shorten the number of student rounds or discussion questions. Do
                not skip the decision, the professional response, the
                consequence or the retry. Those are the learning.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function TimingCard({
  time,
  title,
  detail,
}: {
  time: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black text-[#725500]">{time}</p>

      <p className="mt-1 font-black text-[#0D1B3D]">{title}</p>

      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[#24569B]">
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0D1B3D]">
      {children}
    </p>
  );
}

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#725500]">
        {title}
      </p>

      <div className="mt-3 text-sm font-semibold leading-6 text-slate-700">
        {children}
      </div>
    </div>
  );
}

function RevealCard({
  title,
  subtitle,
  open,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div>
          <p className="text-sm font-black text-[#0D1B3D]">{title}</p>

          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            {subtitle}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#FFF7D6] px-3 py-2 text-xs font-black text-[#725500]">
          {open ? "HIDE" : "REVEAL"}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-200 bg-slate-50 p-5">
          {children}
        </div>
      )}
    </div>
  );
}

function GuideSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
        {title}
      </p>

      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="text-sm font-semibold leading-6 text-slate-700"
          >
            → {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
