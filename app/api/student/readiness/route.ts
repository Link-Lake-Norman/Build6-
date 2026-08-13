import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import {
  DAY_ONE_ASSESSMENT,
  DAY_ONE_QUESTIONS,
  type ReadinessCategory,
} from "@/content/day-one-readiness";

type AnswerPayload = {
  position: number;
  score: number;
};

type CategoryScores = Record<ReadinessCategory, number>;

const CATEGORY_TO_PROFILE_FIELD: Record<
  ReadinessCategory,
  keyof CategoryScores | string
> = {
  SELF_AWARENESS: "selfAwareness",
  COMMUNICATION: "communication",
  LEADERSHIP: "leadership",
  PROFESSIONAL_PRESENCE: "professionalPresence",
  CAREER_READINESS: "careerReadiness",
  ADAPTABILITY: "adaptability",
  AI_READINESS: "aiReadiness",
};

function percentFromAverage(average: number) {
  return Math.round((average / 5) * 100);
}

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session || session.role !== "STUDENT" || !session.studentId) {
      return NextResponse.json(
        { error: "Student authentication required." },
        { status: 401 }
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: session.studentId,
      },
      select: {
        id: true,
        readinessScore: true,
        readinessProfile: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      completed: Boolean(student.readinessProfile?.completedAt),
      readinessScore: Number(student.readinessScore),
      readinessProfile: student.readinessProfile
        ? {
            selfAwareness: Number(student.readinessProfile.selfAwareness),
            communication: Number(student.readinessProfile.communication),
            leadership: Number(student.readinessProfile.leadership),
            professionalPresence: Number(
              student.readinessProfile.professionalPresence
            ),
            careerReadiness: Number(
              student.readinessProfile.careerReadiness
            ),
            adaptability: Number(student.readinessProfile.adaptability),
            aiReadiness: Number(student.readinessProfile.aiReadiness),
            completedAt: student.readinessProfile.completedAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Readiness GET failed:", error);

    return NextResponse.json(
      { error: "Unable to load readiness assessment." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();

    if (!session || session.role !== "STUDENT" || !session.studentId) {
      return NextResponse.json(
        { error: "Student authentication required." },
        { status: 401 }
      );
    }

    const studentId: string = session.studentId;

    const body = await request.json();

    const answers: AnswerPayload[] = Array.isArray(body.answers)
      ? body.answers
      : [];

    if (answers.length !== DAY_ONE_QUESTIONS.length) {
      return NextResponse.json(
        {
          error: `Please answer all ${DAY_ONE_QUESTIONS.length} questions before submitting.`,
        },
        { status: 400 }
      );
    }

    const answerMap = new Map<number, number>();

    for (const answer of answers) {
      if (
        typeof answer.position !== "number" ||
        typeof answer.score !== "number" ||
        !Number.isInteger(answer.position) ||
        !Number.isInteger(answer.score) ||
        answer.position < 1 ||
        answer.position > DAY_ONE_QUESTIONS.length ||
        answer.score < 1 ||
        answer.score > 5
      ) {
        return NextResponse.json(
          { error: "One or more assessment responses are invalid." },
          { status: 400 }
        );
      }

      answerMap.set(answer.position, answer.score);
    }

    if (answerMap.size !== DAY_ONE_QUESTIONS.length) {
      return NextResponse.json(
        { error: "Each assessment question must be answered once." },
        { status: 400 }
      );
    }

    const categoryTotals = new Map<
      ReadinessCategory,
      { total: number; count: number }
    >();

    for (const question of DAY_ONE_QUESTIONS) {
      const score = answerMap.get(question.position);

      if (!score) {
        return NextResponse.json(
          { error: "Assessment response is incomplete." },
          { status: 400 }
        );
      }

      const category = question.category as ReadinessCategory;

      const current = categoryTotals.get(category) ?? {
        total: 0,
        count: 0,
      };

      categoryTotals.set(category, {
        total: current.total + score,
        count: current.count + 1,
      });
    }

    const categoryScores = {} as CategoryScores;

    for (const [category, values] of categoryTotals.entries()) {
      categoryScores[category] = percentFromAverage(
        values.total / values.count
      );
    }

    const overallScore = Math.round(
      Object.values(categoryScores).reduce(
        (sum, value) => sum + value,
        0
      ) / Object.values(categoryScores).length
    );

    const result = await prisma.$transaction(async (tx) => {
      let assessment = await tx.readinessAssessment.findFirst({
        where: {
          name: DAY_ONE_ASSESSMENT.name,
          type: DAY_ONE_ASSESSMENT.type,
          version: DAY_ONE_ASSESSMENT.version,
          active: true,
        },
        include: {
          questions: true,
        },
      });

      if (!assessment) {
        assessment = await tx.readinessAssessment.create({
          data: {
            name: DAY_ONE_ASSESSMENT.name,
            type: DAY_ONE_ASSESSMENT.type,
            version: DAY_ONE_ASSESSMENT.version,
            active: true,
            questions: {
              create: DAY_ONE_QUESTIONS.map((question) => ({
                category: question.category,
                question: question.question,
                position: question.position,
              })),
            },
          },
          include: {
            questions: true,
          },
        });
      }

      const questionsByPosition = new Map(
        assessment.questions.map((question) => [
          question.position,
          question,
        ])
      );

      await tx.readinessResponse.deleteMany({
        where: {
          studentId,
          assessmentId: assessment.id,
        },
      });

      await tx.readinessResponse.createMany({
        data: DAY_ONE_QUESTIONS.map((question) => {
          const databaseQuestion = questionsByPosition.get(
            question.position
          );

          if (!databaseQuestion) {
            throw new Error(
              `Missing readiness question ${question.position}.`
            );
          }

          return {
            assessmentId: assessment.id,
            questionId: databaseQuestion.id,
            studentId,
            score: answerMap.get(question.position)!,
          };
        }),
      });

      await tx.studentReadinessProfile.upsert({
        where: {
          studentId,
        },
        update: {
          selfAwareness: categoryScores.SELF_AWARENESS,
          communication: categoryScores.COMMUNICATION,
          leadership: categoryScores.LEADERSHIP,
          professionalPresence:
            categoryScores.PROFESSIONAL_PRESENCE,
          careerReadiness: categoryScores.CAREER_READINESS,
          adaptability: categoryScores.ADAPTABILITY,
          aiReadiness: categoryScores.AI_READINESS,
          completedAt: new Date(),
        },
        create: {
          studentId,
          selfAwareness: categoryScores.SELF_AWARENESS,
          communication: categoryScores.COMMUNICATION,
          leadership: categoryScores.LEADERSHIP,
          professionalPresence:
            categoryScores.PROFESSIONAL_PRESENCE,
          careerReadiness: categoryScores.CAREER_READINESS,
          adaptability: categoryScores.ADAPTABILITY,
          aiReadiness: categoryScores.AI_READINESS,
          completedAt: new Date(),
        },
      });

      await tx.student.update({
        where: {
          id: studentId,
        },
        data: {
          readinessScore: overallScore,
        },
      });

      return {
        assessmentId: assessment.id,
      };
    });

    return NextResponse.json({
      success: true,
      assessmentId: result.assessmentId,
      overallScore,
      categoryScores,
      destination: `/ambassador/student-portal/${studentId}`,
    });
  } catch (error) {
    console.error("Readiness POST failed:", error);

    return NextResponse.json(
      {
        error:
          "Unable to save your readiness assessment. Please try again.",
      },
      { status: 500 }
    );
  }
}
