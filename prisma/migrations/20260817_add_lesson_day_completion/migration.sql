-- Future Ready™ facilitator delivery tracking.
-- Records completion of a cohort lesson day.
-- Does not modify student LessonProgress.

CREATE TABLE "LessonDayCompletion" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedById" TEXT,
    "facilitatorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonDayCompletion_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "LessonDayCompletion"
ADD CONSTRAINT "LessonDayCompletion_cohortId_fkey"
FOREIGN KEY ("cohortId")
REFERENCES "Cohort"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "LessonDayCompletion"
ADD CONSTRAINT "LessonDayCompletion_lessonId_fkey"
FOREIGN KEY ("lessonId")
REFERENCES "Lesson"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "LessonDayCompletion"
ADD CONSTRAINT "LessonDayCompletion_completedById_fkey"
FOREIGN KEY ("completedById")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE UNIQUE INDEX "LessonDayCompletion_cohortId_lessonId_dayNumber_key"
ON "LessonDayCompletion"("cohortId", "lessonId", "dayNumber");

CREATE INDEX "LessonDayCompletion_cohortId_dayNumber_idx"
ON "LessonDayCompletion"("cohortId", "dayNumber");

CREATE INDEX "LessonDayCompletion_lessonId_idx"
ON "LessonDayCompletion"("lessonId");

CREATE INDEX "LessonDayCompletion_completedById_idx"
ON "LessonDayCompletion"("completedById");
