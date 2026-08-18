CREATE TABLE "FacilitatorDailyNote" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacilitatorDailyNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX
    "FacilitatorDailyNote_lessonId_cohortId_dayNumber_createdAt_idx"
ON "FacilitatorDailyNote"(
    "lessonId",
    "cohortId",
    "dayNumber",
    "createdAt"
);

CREATE INDEX
    "FacilitatorDailyNote_cohortId_createdAt_idx"
ON "FacilitatorDailyNote"(
    "cohortId",
    "createdAt"
);
