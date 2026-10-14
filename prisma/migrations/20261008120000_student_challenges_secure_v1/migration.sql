-- BUILD6 secure student challenges. ADDITIVE ONLY. NOT APPLIED BY INSTALLER.
CREATE TYPE "StudentChallengeStatus" AS ENUM ('SENT','ACCEPTED','IN_PROGRESS','COMPLETED','DECLINED','REVOKED');
CREATE TYPE "StudentChallengeAudience" AS ENUM ('COHORT','EXTERNAL');
CREATE TYPE "StudentChallengeType" AS ENUM ('FINISH_IT','GO_BEYOND','COMMUNITY_AMBASSADOR','LEARN_SHARE','FIND_OPPORTUNITY','MAKE_CONNECTION','PROFESSIONAL_COURAGE','THANK_SOMEONE','OWN_WEEK');
CREATE TABLE "StudentChallenge" (
  "id" TEXT NOT NULL,
  "senderStudentId" TEXT NOT NULL,
  "recipientStudentId" TEXT,
  "cohortId" TEXT,
  "audience" "StudentChallengeAudience" NOT NULL,
  "type" "StudentChallengeType" NOT NULL,
  "title" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "personalNote" TEXT,
  "points" INTEGER NOT NULL DEFAULT 10,
  "status" "StudentChallengeStatus" NOT NULL DEFAULT 'SENT',
  "dueAt" TIMESTAMP(3),
  "acceptedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "declinedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "moderationReason" TEXT,
  "evidenceText" TEXT,
  "externalRecipientLabel" TEXT,
  "shareTokenHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StudentChallenge_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StudentChallenge_shareTokenHash_key" ON "StudentChallenge"("shareTokenHash");
CREATE INDEX "StudentChallenge_senderStudentId_createdAt_idx" ON "StudentChallenge"("senderStudentId","createdAt");
CREATE INDEX "StudentChallenge_recipientStudentId_status_createdAt_idx" ON "StudentChallenge"("recipientStudentId","status","createdAt");
CREATE INDEX "StudentChallenge_cohortId_createdAt_idx" ON "StudentChallenge"("cohortId","createdAt");
CREATE INDEX "StudentChallenge_status_expiresAt_idx" ON "StudentChallenge"("status","expiresAt");
ALTER TABLE "StudentChallenge" ADD CONSTRAINT "StudentChallenge_senderStudentId_fkey" FOREIGN KEY ("senderStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentChallenge" ADD CONSTRAINT "StudentChallenge_recipientStudentId_fkey" FOREIGN KEY ("recipientStudentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StudentChallenge" ADD CONSTRAINT "StudentChallenge_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;
