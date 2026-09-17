-- Create the existing Future Ready™ CohortExperience model in production.
-- This adds a new table only. Existing student, curriculum, assignment,
-- attendance, resource, and cohort records are not modified.

CREATE TABLE "CohortExperience" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "lessonId" TEXT,
    "weekNumber" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL DEFAULT 1,

    "experienceType" TEXT NOT NULL DEFAULT 'FIELD_TRIP',
    "title" TEXT NOT NULL,
    "description" TEXT,

    "eventDate" TIMESTAMP(3),
    "startTime" TEXT,
    "endTime" TEXT,
    "departureTime" TEXT,
    "returnTime" TEXT,

    "siteName" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,

    "contactName" TEXT,
    "contactTitle" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,

    "transportationNotes" TEXT,
    "parkingNotes" TEXT,

    "requiredAttire" TEXT,
    "accommodations" TEXT,
    "foodNotes" TEXT,

    "waiverRequired" BOOLEAN NOT NULL DEFAULT false,
    "waiverNotes" TEXT,

    "capacity" INTEGER,
    "chaperoneNotes" TEXT,

    "learningObjective" TEXT,
    "careerConnection" TEXT,

    "preTripPreparation" TEXT,
    "studentQuestions" TEXT,
    "postTripReflection" TEXT,

    "studentVisibleNotes" TEXT,
    "facilitatorNotes" TEXT,

    "visibleToStudent" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',

    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortExperience_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CohortExperience"
ADD CONSTRAINT "CohortExperience_cohortId_fkey"
FOREIGN KEY ("cohortId")
REFERENCES "Cohort"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "CohortExperience"
ADD CONSTRAINT "CohortExperience_lessonId_fkey"
FOREIGN KEY ("lessonId")
REFERENCES "Lesson"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE INDEX "CohortExperience_cohortId_weekNumber_dayNumber_idx"
ON "CohortExperience"("cohortId", "weekNumber", "dayNumber");

CREATE INDEX "CohortExperience_lessonId_idx"
ON "CohortExperience"("lessonId");

CREATE INDEX "CohortExperience_eventDate_idx"
ON "CohortExperience"("eventDate");

CREATE INDEX "CohortExperience_experienceType_status_idx"
ON "CohortExperience"("experienceType", "status");
