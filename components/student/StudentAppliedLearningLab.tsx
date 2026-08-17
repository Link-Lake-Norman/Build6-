"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export type StudentAppliedLearningAsset = {
  id: string;
  title: string;
  format: string;
  audience: string;
  skills: string[];
  whyItMatters: string;
  scenario: string;
  studentChallenge: string[];

  roles?: {
    role: string;
    responsibility: string;
  }[];

  professionalLanguage?: {
    situation: string;
    insteadOf: string;
    tryThis: string;
  }[];

  curveballs?: string[];

  retryPrompt?: string;

  discussionQuestions: string[];
  reflectionPrompts: string[];

  portfolioEvidence?: string;

  athleteExtension?: {
    title: string;
    scenario: string;
    considerations: string[];
  };
};

type Props = {
  week: number;
  studentId: string;
  assets: StudentAppliedLearningAsset[];
};

type Stage = "scenario" | "challenge" | "curveball" | "retry" | "reflect";

export default function StudentAppliedLearningLab({
  week,
  studentId,
  assets,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("scenario");
  const [curveballIndex, setCurveballIndex] = useState(0);

  if (!assets.length) {
    return null;
  }

  const selected = assets[selectedIndex];

  const curveballs = selected.curveballs ?? [];

  const hasCurveballs = curveballs.length > 0;

  const hasRetry = Boolean(selected.retryPrompt);

  const currentCurveball = hasCurveballs
    ? curveballs[Math.min(curveballIndex, curveballs.length - 1)]
    : null;

  function selectAsset(index: number) {
    setSelectedIndex(index);
    setStage("scenario");
    setCurveballIndex(0);
  }

  function afterChallenge() {
    if (hasCurveballs) {
      setStage("curveball");
      return;
    }

    if (hasRetry) {
      setStage("retry");
      return;
    }

    setStage("reflect");
  }

  function afterCurveball() {
    if (curveballIndex < curveballs.length - 1) {
      setCurveballIndex((current) => current + 1);

      return;
    }

    if (hasRetry) {
      setStage("retry");
      return;
    }

    setStage("reflect");
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="bg-[#0D1B3D] px-6 py-8 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F2B705]">
              Future Ready™ Applied Learning
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Practice It Before It Counts
            </h2>

            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-200">
              You will make decisions, communicate, adapt when the situation
              changes and try again. Real life rarely comes with an answer key.
            </p>
          </div>

          <div className="w-fit rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#F2B705]">
              Week {week}
            </p>

            <p className="mt-1 font-black">Interactive Lab</p>
          </div>
        </div>
      </header>

      {assets.length > 1 ? (
        <div className="border-b border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            This Week&apos;s Labs
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            Your facilitator will tell you which lab to run today.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {assets.map((asset, index) => {
              const active = selectedIndex === index;

              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => selectAsset(index)}
                  className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                    active
                      ? "bg-[#0D1B3D] text-white"
                      : "border border-slate-200 bg-white text-[#0D1B3D] hover:border-[#F2B705]"
                  }`}
                >
                  {asset.title}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <Pill>{selected.format}</Pill>

          <Pill>{selected.audience}</Pill>
        </div>

        <h3 className="mt-4 text-2xl font-black text-[#0D1B3D]">
          {selected.title}
        </h3>

        <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-slate-600">
          {selected.whyItMatters}
        </p>

        <div className="mt-6 rounded-2xl border border-[#F2B705]/40 bg-[#FFFBEA] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#725500]">
            50-Minute Class Rule
          </p>

          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
            Your goal is not to race through every screen. Make the decision,
            participate in the conversation and improve your response when the
            situation changes.
          </p>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <StageButton
            step="1"
            label="Scenario"
            active={stage === "scenario"}
            onClick={() => setStage("scenario")}
          />

          <StageButton
            step="2"
            label="Challenge"
            active={stage === "challenge"}
            onClick={() => setStage("challenge")}
          />

          <StageButton
            step="3"
            label="Curveball"
            active={stage === "curveball"}
            disabled={!hasCurveballs}
            onClick={() => setStage("curveball")}
          />

          <StageButton
            step="4"
            label="Retry"
            active={stage === "retry"}
            disabled={!hasRetry}
            onClick={() => setStage("retry")}
          />

          <StageButton
            step="5"
            label="Reflect"
            active={stage === "reflect"}
            onClick={() => setStage("reflect")}
          />
        </div>

        <div className="mt-6">
          {stage === "scenario" ? (
            <StageCard kicker="STEP 1 · READ THE ROOM" title="The Situation">
              <p className="text-lg font-semibold leading-8 text-slate-700">
                {selected.scenario}
              </p>

              {selected.roles?.length ? (
                <div className="mt-6">
                  <SectionLabel>Assign the Roles</SectionLabel>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {selected.roles.map((role) => (
                      <div
                        key={`${selected.id}-${role.role}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="font-black text-[#0D1B3D]">{role.role}</p>

                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                          {role.responsibility}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <ContinueButton onClick={() => setStage("challenge")}>
                I Understand the Situation →
              </ContinueButton>
            </StageCard>
          ) : null}

          {stage === "challenge" ? (
            <StageCard kicker="STEP 2 · MAKE THE CALL" title="Your Challenge">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black leading-6 text-[#0D1B3D]">
                  There may be more than one reasonable response. Make your
                  decision and be ready to explain why.
                </p>
              </div>

              <div className="mt-5">
                <NumberedList items={selected.studentChallenge} />
              </div>

              {selected.professionalLanguage?.length ? (
                <div className="mt-7">
                  <SectionLabel>Professional Language Lab</SectionLabel>

                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    Practice saying it out loud. Professional communication is a
                    skill, not a phrase you simply read.
                  </p>

                  <div className="mt-4 space-y-3">
                    {selected.professionalLanguage.map((language, index) => (
                      <div
                        key={`${selected.id}-language-${index}`}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                      >
                        <p className="font-black text-[#0D1B3D]">
                          {language.situation}
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="rounded-xl bg-red-50 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-700">
                              Instead of
                            </p>

                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                              “{language.insteadOf}”
                            </p>
                          </div>

                          <div className="rounded-xl bg-emerald-50 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                              Try this
                            </p>

                            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                              “{language.tryThis}”
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <ContinueButton onClick={afterChallenge}>
                Lock In My Decision →
              </ContinueButton>
            </StageCard>
          ) : null}

          {stage === "curveball" ? (
            <StageCard kicker="STEP 3 · SOMETHING CHANGED" title="⚡ Curveball">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-black text-amber-950">
                  Do not open this early.
                </p>

                <p className="mt-1 text-sm font-semibold leading-6 text-amber-800">
                  Wait until your facilitator says it is time to reveal the
                  curveball.
                </p>
              </div>

              {currentCurveball ? (
                <div className="mt-5 rounded-2xl bg-[#0D1B3D] p-6 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-[#F2B705]">
                    New Information
                  </p>

                  <p className="mt-3 text-xl font-black leading-8">
                    {currentCurveball}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-black text-[#0D1B3D]">
                  Your original decision is no longer enough.
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  What changes? What stays the same? What would you communicate
                  now?
                </p>
              </div>

              <ContinueButton onClick={afterCurveball}>
                {curveballIndex < curveballs.length - 1
                  ? "Facilitator Says: Next Curveball →"
                  : hasRetry
                    ? "Run It Again →"
                    : "Reflect →"}
              </ContinueButton>
            </StageCard>
          ) : null}

          {stage === "retry" ? (
            <StageCard kicker="STEP 4 · GET ANOTHER REP" title="The Retry">
              <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6">
                <p className="text-lg font-black leading-8 text-emerald-950">
                  {selected.retryPrompt}
                </p>
              </div>

              <p className="mt-5 text-sm font-semibold leading-7 text-slate-600">
                The goal is not to pretend your first response was perfect. Use
                what you noticed and make the next response stronger.
              </p>

              <ContinueButton onClick={() => setStage("reflect")}>
                I Ran It Again — Reflect →
              </ContinueButton>
            </StageCard>
          ) : null}

          {stage === "reflect" ? (
            <StageCard
              kicker="STEP 5 · MAKE IT STICK"
              title="Reflect + Prove It"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <SectionLabel>Think About It</SectionLabel>

                  <div className="mt-3 space-y-3">
                    {selected.reflectionPrompts.map((prompt, index) => (
                      <div
                        key={`${selected.id}-reflection-${index}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-sm font-bold leading-6 text-slate-700">
                          {index + 1}. {prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel>Talk It Out</SectionLabel>

                  <div className="mt-3 space-y-3">
                    {selected.discussionQuestions.map((question, index) => (
                      <div
                        key={`${selected.id}-discussion-${index}`}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <p className="text-sm font-bold leading-6 text-slate-700">
                          {question}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selected.athleteExtension ? (
                <div className="mt-7 rounded-3xl border-2 border-[#F2B705] bg-[#FFFBEA] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-[#725500]">
                    🏅 Athlete Pathway
                  </p>

                  <h5 className="mt-2 text-xl font-black text-[#0D1B3D]">
                    {selected.athleteExtension.title}
                  </h5>

                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-700">
                    {selected.athleteExtension.scenario}
                  </p>

                  <div className="mt-4 space-y-2">
                    {selected.athleteExtension.considerations.map(
                      (consideration, index) => (
                        <div
                          key={`${selected.id}-athlete-${index}`}
                          className="flex gap-3 text-sm font-semibold leading-6 text-slate-700"
                        >
                          <span className="font-black text-[#725500]">→</span>

                          <span>{consideration}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : null}

              {selected.portfolioEvidence ? (
                <div className="mt-7 rounded-3xl bg-[#0D1B3D] p-6 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-[#F2B705]">
                    Future Ready™ Evidence
                  </p>

                  <p className="mt-3 text-base font-black leading-7">
                    {selected.portfolioEvidence}
                  </p>
                </div>
              ) : null}

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href={`/ambassador/student-passport/${studentId}/reflections`}
                  className="rounded-xl bg-[#0D1B3D] px-5 py-4 text-center text-sm font-black text-white"
                >
                  Write My Reflection →
                </a>

                <a
                  href={`/ambassador/student-passport/${studentId}/portfolio`}
                  className="rounded-xl border-2 border-[#0D1B3D] bg-white px-5 py-4 text-center text-sm font-black text-[#0D1B3D]"
                >
                  Add Portfolio Evidence →
                </a>
              </div>
            </StageCard>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <SectionLabel>Skills You&apos;re Practicing</SectionLabel>

          <div className="mt-3 flex flex-wrap gap-2">
            {selected.skills.map((skill) => (
              <span
                key={`${selected.id}-${skill}`}
                className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#0D1B3D] shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageButton({
  step,
  label,
  active,
  disabled = false,
  onClick,
}: {
  step: string;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition ${
        disabled
          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
          : active
            ? "border-[#0D1B3D] bg-[#0D1B3D] text-white"
            : "border-slate-200 bg-white text-[#0D1B3D] hover:border-[#F2B705]"
      }`}
    >
      <p
        className={`text-[10px] font-black uppercase tracking-[0.13em] ${
          active ? "text-[#F2B705]" : "text-slate-400"
        }`}
      >
        Step {step}
      </p>

      <p className="mt-1 text-sm font-black">{label}</p>
    </button>
  );
}

function StageCard({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-xs font-black uppercase tracking-[0.15em] text-[#725500]">
        {kicker}
      </p>

      <h4 className="mt-2 text-2xl font-black text-[#0D1B3D]">{title}</h4>

      <div className="mt-5">{children}</div>
    </article>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${index}-${item}`}
          className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D1B3D] text-sm font-black text-white">
            {index + 1}
          </span>

          <p className="pt-1 text-sm font-bold leading-6 text-slate-700">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

function ContinueButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 rounded-xl bg-[#0D1B3D] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-black uppercase tracking-[0.15em] text-[#725500]">
      {children}
    </p>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-[#EAF2FF] px-3 py-2 text-xs font-black text-[#24569B]">
      {children}
    </span>
  );
}
