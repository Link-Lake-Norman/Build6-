import {
  assessmentQuestions,
} from "./questions";

import {
  careerRoles,
} from "./careers";

import type {
  AssessmentDimension,
} from "./types";

export type AssessmentAnswers =
  Record<string, string[]>;

export type DimensionScore =
  {
    dimension: AssessmentDimension;
    score: number;
  };

export type CareerMatch = {
  id: string;
  title: string;
  pathway: string;
  description: string;
  environment: string;
  education: string;
  nextStep: string;
  relatedRoles: string[];
  score: number;
  fitReasons: string[];
};

const dimensionLabels:
  Record<AssessmentDimension, string> =
{
  people: "People + Relationships",
  communication: "Communication",
  leadership: "Leadership",
  creativity: "Creativity",
  problemSolving: "Problem Solving",
  analytical: "Analytical Thinking",
  technology: "Technology",
  handsOn: "Hands-On Work",
  service: "Helping + Service",
  organization: "Organization",
  entrepreneurship: "Entrepreneurship",
  outdoors: "Outdoor / Field Work",
  movement: "Active Work",
  computer: "Computer-Based Work",
  independence: "Independent Work",
  teamwork: "Teamwork",
};

function emptyScores() {
  const keys =
    Object.keys(
      dimensionLabels
    ) as AssessmentDimension[];

  return Object.fromEntries(
    keys.map(
      (key) => [key, 0]
    )
  ) as Record<
    AssessmentDimension,
    number
  >;
}

export function scoreAssessment(
  answers: AssessmentAnswers
) {
  const totals = emptyScores();

  for (
    const question
    of assessmentQuestions
  ) {
    const selected =
      answers[question.id] ?? [];

    for (
      const selectedValue
      of selected
    ) {
      const option =
        question.options.find(
          (item) =>
            item.value ===
            selectedValue
        );

      if (!option) continue;

      for (
        const [
          dimension,
          value,
        ]
        of Object.entries(
          option.weights
        )
      ) {
        const key = dimension as AssessmentDimension;

        totals[key] +=
          value ?? 0;
      }
    }
  }

  const dimensions =
    Object.entries(totals)
      .map(
        ([dimension, score]) => ({
          dimension: dimension as AssessmentDimension,
          score,
        })
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  const maxDimensionScore =
    Math.max(
      ...dimensions.map(
        (item) => item.score
      ),
      1
    );

  const normalized =
    Object.fromEntries(
      dimensions.map(
        (item) => [
          item.dimension,
          item.score /
            maxDimensionScore,
        ]
      )
    ) as Record<
      AssessmentDimension,
      number
    >;

  const careerMatches:
    CareerMatch[] =
      careerRoles
        .map((career) => {
          let raw = 0;
          const contributions:
            {
              dimension:
                AssessmentDimension;
              contribution: number;
            }[] = [];

          for (
            const [
              dimension,
              weight,
            ]
            of Object.entries(
              career.weights
            )
          ) {
            const key = dimension as AssessmentDimension;

            const contribution =
              (normalized[key] ?? 0) *
              (weight ?? 0);

            raw += contribution;

            if (
              contribution > 0
            ) {
              contributions.push({
                dimension: key,
                contribution,
              });
            }
          }

          const maxCareerWeight =
            Object.values(
              career.weights
            ).reduce(
              (sum, value) =>
                sum + (value ?? 0),
              0
            );

          const percentage =
            maxCareerWeight > 0
              ? Math.round(
                  (raw /
                    maxCareerWeight) *
                    100
                )
              : 0;

          const fitReasons =
            contributions
              .sort(
                (a, b) =>
                  b.contribution -
                  a.contribution
              )
              .slice(0, 3)
              .map(
                (item) =>
                  dimensionLabels[
                    item.dimension
                  ]
              );

          return {
            id: career.id,
            title: career.title,
            pathway:
              career.pathway,
            description:
              career.description,
            environment:
              career.environment,
            education:
              career.education,
            nextStep:
              career.nextStep,
            relatedRoles:
              career.relatedRoles,
            score: percentage,
            fitReasons,
          };
        })
        .sort(
          (a, b) =>
            b.score - a.score
        )
        .slice(0, 8);

  const pathwayMap =
    new Map<
      string,
      {
        pathway: string;
        score: number;
        count: number;
      }
    >();

  for (
    const match
    of careerMatches
  ) {
    const current =
      pathwayMap.get(
        match.pathway
      ) ?? {
        pathway:
          match.pathway,
        score: 0,
        count: 0,
      };

    current.score +=
      match.score;
    current.count += 1;

    pathwayMap.set(
      match.pathway,
      current
    );
  }

  const pathways =
    Array.from(
      pathwayMap.values()
    )
      .map((item) => ({
        pathway:
          item.pathway,
        score:
          Math.round(
            item.score /
              item.count
          ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 4);

  const topDimensions =
    dimensions
      .slice(0, 6)
      .map((item) => ({
        ...item,
        label:
          dimensionLabels[
            item.dimension
          ],
      }));

  const first =
    topDimensions[0]
      ?.dimension;

  const second =
    topDimensions[1]
      ?.dimension;

  const profileTitle =
    buildProfileTitle(
      first,
      second
    );

  return {
    profileTitle,
    dimensions,
    topDimensions,
    pathways,
    careerMatches,
  };
}

function buildProfileTitle(
  first?: AssessmentDimension,
  second?: AssessmentDimension
) {
  const adjective:
    Partial<
      Record<
        AssessmentDimension,
        string
      >
    > = {
    people: "People-Centered",
    communication:
      "Expressive",
    leadership:
      "Purposeful",
    creativity:
      "Creative",
    problemSolving:
      "Resourceful",
    analytical:
      "Strategic",
    technology:
      "Tech-Driven",
    handsOn:
      "Hands-On",
    service:
      "Impact-Driven",
    organization:
      "Organized",
    entrepreneurship:
      "Enterprising",
    outdoors:
      "Field-Oriented",
    movement:
      "Active",
    computer:
      "Digital",
    independence:
      "Independent",
    teamwork:
      "Collaborative",
  };

  const noun:
    Partial<
      Record<
        AssessmentDimension,
        string
      >
    > = {
    people: "Connector",
    communication:
      "Communicator",
    leadership:
      "Leader",
    creativity:
      "Creator",
    problemSolving:
      "Problem Solver",
    analytical:
      "Thinker",
    technology:
      "Builder",
    handsOn:
      "Builder",
    service:
      "Helper",
    organization:
      "Planner",
    entrepreneurship:
      "Innovator",
    outdoors:
      "Explorer",
    movement:
      "Doer",
    computer:
      "Digital Builder",
    independence:
      "Self-Starter",
    teamwork:
      "Collaborator",
  };

  return `${
    adjective[first ?? "people"]
      ?? "Future-Focused"
  } ${
    noun[second ?? first ?? "problemSolving"]
      ?? "Problem Solver"
  }`;
}
