CREATE TYPE "StudentSupportPlanType" AS ENUM (
  'NONE',
  'SECTION_504',
  'IEP',
  'SERVICES_PLAN',
  'SCHOOL_ACCOMMODATION',
  'OTHER'
);

CREATE TABLE "StudentAccessibilityProfile" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "readingMode" BOOLEAN NOT NULL DEFAULT false,
  "focusMode" BOOLEAN NOT NULL DEFAULT false,
  "largeText" BOOLEAN NOT NULL DEFAULT false,
  "increasedSpacing" BOOLEAN NOT NULL DEFAULT false,
  "highContrast" BOOLEAN NOT NULL DEFAULT false,
  "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
  "highlightInstructions" BOOLEAN NOT NULL DEFAULT false,
  "chunkInstructions" BOOLEAN NOT NULL DEFAULT false,
  "planType" "StudentSupportPlanType" NOT NULL DEFAULT 'NONE',
  "planActive" BOOLEAN NOT NULL DEFAULT false,
  "extendedDeadlineDays" INTEGER NOT NULL DEFAULT 0,
  "timeMultiplier" DECIMAL(4,2) NOT NULL DEFAULT 1.00,
  "breaksAllowed" BOOLEAN NOT NULL DEFAULT false,
  "noTimedActivities" BOOLEAN NOT NULL DEFAULT false,
  "speechToText" BOOLEAN NOT NULL DEFAULT false,
  "alternativeResponse" BOOLEAN NOT NULL DEFAULT false,
  "staffNotes" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "reviewedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "StudentAccessibilityProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StudentAccessibilityProfile_studentId_key"
ON "StudentAccessibilityProfile"("studentId");

CREATE INDEX "StudentAccessibilityProfile_planType_planActive_idx"
ON "StudentAccessibilityProfile"("planType", "planActive");

ALTER TABLE "StudentAccessibilityProfile"
ADD CONSTRAINT "StudentAccessibilityProfile_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "Student"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
