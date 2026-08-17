import type { AppliedLearningAsset } from "@/content/applied-learning";

export type ThursdayExperiencePlan = {
  preparationQuestions: string[];
  duringExperience: string[];
  debriefQuestions: string[];
  portfolioEvidence?: string;
};

export type ThursdayClassroomPlan = {
  title: string;
  description: string;
  appliedLearningAssetIds?: string[];
};

export type AmbassadorWeekDelivery = {
  week: number;

  monday: {
    reflectionPrompt: string[];
    organizationTasks: string[];
    projectWork?: string[];
    capstoneWork?: string[];
  };

  tuesday: {
    lessonWeek: number;
  };

  wednesday: {
    appliedLearningAssetIds: string[];
  };

  thursday: {
    experience: ThursdayExperiencePlan;
    classroom: ThursdayClassroomPlan;
  };

  friday: {
    closingQuestions: string[];
  };
};

export function resolveAppliedLearningAssets(
  ids: string[],
  assets: AppliedLearningAsset[],
) {
  return ids
    .map((id) => assets.find((asset) => asset.id === id))
    .filter((asset): asset is AppliedLearningAsset => Boolean(asset));
}
