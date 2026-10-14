"use client";

import { useState } from "react";
import Build6ActivityPresentation from "@/components/ambassador/Build6ActivityPresentation";
import { generateActivityOptions } from "@/content/ai-lesson-generator";
import type { Build6GameMode } from "@/content/build6-game-engine";
import { readBuild6UsedCaseIds, rememberBuild6Cases } from "@/content/build6-case-ledger";
import type { AIActivityType, AIGeneratedActivity } from "@/content/ai-activity-types";

type Props = {
  week: number;
  day: number;
  topic: string;
  objective: string;
  activityTypeHint?: string;
  durationMinutes?: number;
  taskKey: string;
};

function inferActivityType(value: string): AIActivityType {
  const text = value.toLowerCase();
  if (text.includes("role")) return "Role Play";
  if (text.includes("improv")) return "Improv";
  if (text.includes("team")) return "Team Building";
  if (text.includes("quiz")) return "Pop Quiz";
  if (text.includes("reflect")) return "Reflection";
  if (text.includes("career")) return "Career Connection";
  if (text.includes("media") || text.includes("camera") || text.includes("video")) return "Media Practice";
  if (text.includes("capstone")) return "Capstone Workshop";
  if (text.includes("speaker") || text.includes("guest")) return "Guest Speaker Preparation";
  return "Case Scenario";
}

function inferGameMode(value: string): Build6GameMode {
  const text = value.toLowerCase();
  if (text.includes("speaker") || text.includes("guest")) return "Speaker Warm-Up";
  if (text.includes("tour") || text.includes("visit") || text.includes("experience")) return "Tour / Experience Prep";
  if (text.includes("finance") || text.includes("money") || text.includes("budget")) return "Financial Literacy Game";
  if (text.includes("conflict")) return "Conflict Scenario";
  if (text.includes("network")) return "Networking Challenge";
  if (text.includes("interview")) return "Interview Practice";
  if (text.includes("camera") || text.includes("media") || text.includes("present")) return "Camera / Presentation Challenge";
  if (text.includes("career")) return "Career Exploration Game";
  if (text.includes("lead")) return "Leadership Game";
  if (text.includes("community") || text.includes("nonprofit")) return "Community Connection";
  if (text.includes("improv")) return "Improv Game";
  if (text.includes("team")) return "Team Competition";
  if (text.includes("role")) return "Role-Play Scenario";
  return "Random BUILD6 Game";
}

function stableVariation(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return (hash % 10000) + 1;
}

export default function Build6GeneratedTopicPresentation({
  week, day, topic, objective, activityTypeHint = "", durationMinutes = 12, taskKey,
}: Props) {
  const [activity, setActivity] = useState<AIGeneratedActivity | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const activityType = inferActivityType(`${activityTypeHint} ${topic}`);

  function generateDifferentPresentation() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const excludedCaseIds = readBuild6UsedCaseIds();
      const result = generateActivityOptions({
        week,
        day: `Day ${day}`,
        topic,
        objective: objective || `Apply ${topic} professionally in a realistic workplace situation.`,
        activityType,
        audience: "BUILD6 classroom",
        gameMode: inferGameMode(`${activityTypeHint} ${topic}`),
        gameModifiers: ["MORE_FUN"],
        variation: stableVariation(`${taskKey}-${excludedCaseIds.length}`),
        excludedCaseIds,
        availableMinutes: Math.max(10, Math.min(15, durationMinutes || 12)),
        classSize: 20,
      })[0];
      if (!result) throw new Error("No presentation option was generated.");
      rememberBuild6Cases(result);
      setActivity(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not generate the BUILD6 presentation.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-[#E2B93B]/50 bg-[#FFFDF5] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#8A6300]">BUILD6™ PRESENTATION · {activityType}</p>
          <p className="mt-1 text-xs text-slate-600">Attached to this topic · official BUILD6 logo · 3 unique workplace cases · screen-share + editable PowerPoint</p>
        </div>
        <button type="button" onClick={generateDifferentPresentation} disabled={busy} className="rounded-lg bg-[#0D1B3D] px-3 py-2 text-xs font-black text-white disabled:opacity-60">
          {busy ? "Generating…" : activity ? "Generate Different Option" : "Generate Presentation"}
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-bold text-red-700">{error}</p>}
      {activity && <Build6ActivityPresentation activity={activity} week={week} day={`Day ${day}`} />}
    </div>
  );
}
