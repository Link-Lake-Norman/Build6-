-- CreateTable
CREATE TABLE "CohortInvitation" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "schoolId" TEXT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "invitedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CohortInvitation_tokenHash_key" ON "CohortInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "CohortInvitation_cohortId_status_idx" ON "CohortInvitation"("cohortId", "status");

-- CreateIndex
CREATE INDEX "CohortInvitation_email_status_idx" ON "CohortInvitation"("email", "status");

-- CreateIndex
CREATE INDEX "CohortInvitation_organizationId_status_idx" ON "CohortInvitation"("organizationId", "status");

