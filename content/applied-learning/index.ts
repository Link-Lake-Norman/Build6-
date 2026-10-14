export type {
  AppliedLearningAsset,
  AppliedLearningAudience,
  AppliedLearningFormat,
} from "./types";

export { week01AppliedLearning } from "./week-01";
export { weeks02To08AppliedLearning } from "./weeks-02-08";
export { weeks09To16AppliedLearning } from "./weeks-09-16";
export { weeks09To12RebuildAppliedLearning } from "./weeks-09-12-rebuild";

import type { AppliedLearningAsset } from "./types";
import { week01AppliedLearning } from "./week-01";
import { weeks02To08AppliedLearning } from "./weeks-02-08";
import { weeks09To16AppliedLearning } from "./weeks-09-16";
import { weeks09To12RebuildAppliedLearning } from "./weeks-09-12-rebuild";

export const appliedLearningAssets: AppliedLearningAsset[] = [
  ...week01AppliedLearning,
  ...weeks02To08AppliedLearning,
  ...weeks09To12RebuildAppliedLearning,
  ...weeks09To16AppliedLearning,
];

export function getAppliedLearningForWeek(
  week: number,
): AppliedLearningAsset[] {
  return appliedLearningAssets.filter((asset) => asset.week === week);
}

export function getAppliedLearningForAudience(
  week: number,
  audience: "Core" | "Athlete Pathway",
): AppliedLearningAsset[] {
  return getAppliedLearningForWeek(week).filter(
    (asset) => asset.audience === "Both" || asset.audience === audience,
  );
}
