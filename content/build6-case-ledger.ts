import type { AIGeneratedActivity } from "./ai-activity-types";

const KEY = "build6_unique_case_ids_v1";

export function readBuild6UsedCaseIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(stored) ? stored.filter((value): value is string => typeof value === "string") : [];
  } catch { return []; }
}

export function rememberBuild6Cases(activity: AIGeneratedActivity): void {
  if (typeof window === "undefined") return;
  const ids = readBuild6UsedCaseIds();
  for (const item of activity.presentationCases ?? []) {
    if (!ids.includes(item.id)) ids.push(item.id);
  }
  window.localStorage.setItem(KEY, JSON.stringify(ids));
}
