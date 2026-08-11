"use client";

import { useEffect, useState } from "react";
import {
  LESSON_BUILDER_STORAGE_KEY,
  type LessonCustomization,
} from "@/content/lesson-builder";

export default function LessonCustomizationView({ week }: { week: number }) {
  const [customization, setCustomization] =
    useState<LessonCustomization | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LESSON_BUILDER_STORAGE_KEY);
      const items = saved ? (JSON.parse(saved) as LessonCustomization[]) : [];
      const published = items.find(
        (item) => item.week === week && item.status === "Published",
      );
      setCustomization(published ?? null);
    } catch {
      setCustomization(null);
    }
  }, [week]);

  if (!customization) return null;

  const sections = [
    ["Delivery Notes", customization.deliveryNotes],
    ["Launch / Icebreaker", customization.launchActivity],
    ["Team Huddle", customization.teamHuddle],
    ["Workplace Challenge", customization.workplaceChallenge],
    ["Role Play", customization.rolePlay],
    ["Improv", customization.improv],
    ["Case Scenario", customization.caseScenario],
    ["Reflection Prompt", customization.reflectionPrompt],
  ].filter(([, value]) => Boolean(value));

  return (
    <section className="rounded-3xl border border-[#F2B705] bg-[#FFF9DF] p-8 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#725500]">
        Ambassador Christian School Version
      </p>
      <h2 className="mt-2 text-3xl font-black text-[#0D1B3D]">
        {customization.localTitle || `Week ${week} Delivery Plan`}
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {customization.timing ? (
          <Info label="Timing" value={customization.timing} />
        ) : null}
        {customization.materials ? (
          <Info label="Materials" value={customization.materials} />
        ) : null}
        {customization.speakerName ? (
          <Info
            label="Professional"
            value={`${customization.speakerName}${
              customization.speakerTopic
                ? ` — ${customization.speakerTopic}`
                : ""
            }`}
          />
        ) : null}
      </div>

      {sections.length ? (
        <div className="mt-6 grid gap-4">
          {sections.map(([label, value]) => (
            <Info key={label} label={label} value={value} />
          ))}
        </div>
      ) : null}

      {customization.resources.length ? (
        <div className="mt-6">
          <h3 className="text-xl font-black text-[#0D1B3D]">
            Lesson Resources
          </h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {customization.resources.map((resource) => (
              <article
                key={resource.id}
                className="rounded-2xl border border-white bg-white p-4"
              >
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#725500]">
                  {resource.type}
                </p>
                <p className="mt-1 font-black text-[#0D1B3D]">
                  {resource.title}
                </p>
                {resource.notes ? (
                  <p className="mt-1 text-sm text-slate-600">
                    {resource.notes}
                  </p>
                ) : null}
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block font-black text-[#24569B]"
                  >
                    Open Resource
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
        {value}
      </p>
    </div>
  );
}
