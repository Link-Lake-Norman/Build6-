-- CreateEnum
CREATE TYPE "LifeAccountStatus" AS ENUM ('ACTIVE', 'FROZEN', 'RECOVERY', 'CLOSED');

-- CreateEnum
CREATE TYPE "LifeTransactionType" AS ENUM ('OPENING_BALANCE', 'PAYDAY', 'ATTENDANCE_PAY', 'ASSIGNMENT_PAY', 'REFLECTION_PAY', 'LESSON_COMPLETION_PAY', 'PORTFOLIO_PAY', 'FRIDAY_CHECK_BONUS', 'STREAK_BONUS', 'SKILL_BONUS', 'LEADERSHIP_BONUS', 'INITIATIVE_BONUS', 'FACILITATOR_BONUS', 'SIDE_HUSTLE', 'CUSTOM_EARNING', 'PURCHASE', 'BILL_PAYMENT', 'GAS', 'FOOD', 'INSURANCE', 'SUBSCRIPTION', 'ENTERTAINMENT', 'CONCERT', 'CLOTHING', 'BEAUTY', 'TECHNOLOGY', 'TRANSPORTATION', 'DONATION', 'COMMUNITY_FUND', 'PEER_GIFT', 'PEER_LOAN_OUT', 'PEER_LOAN_IN', 'PEER_REPAYMENT', 'SAVINGS_TRANSFER', 'SAVINGS_WITHDRAWAL', 'LATE_FEE', 'OVERDRAFT_FEE', 'ACCOUNT_NEGLECT_FEE', 'MISSED_OBLIGATION', 'CUSTOM_CHARGE', 'REFUND', 'INTEREST', 'EMPLOYER_MATCH', 'LIFE_EVENT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "EconomyTransactionDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "EconomyGoalCategory" AS ENUM ('CAR', 'FIRST_HOME', 'VACATION', 'TRAVEL', 'FASHION', 'LUXURY', 'SHOES', 'TECHNOLOGY', 'EDUCATION', 'BUSINESS', 'EMERGENCY_FUND', 'INVESTING', 'WEALTH', 'FINANCIAL_FREEDOM', 'FAMILY', 'OTHER');

-- CreateEnum
CREATE TYPE "EconomyBillCategory" AS ENUM ('CAR_PAYMENT', 'GAS', 'AUTO_INSURANCE', 'FOOD', 'PHONE', 'RENT', 'UTILITIES', 'SUBSCRIPTION', 'ENTERTAINMENT', 'BEAUTY', 'CLOTHING', 'TRANSPORTATION', 'CREDIT', 'LOAN', 'OTHER');

-- CreateEnum
CREATE TYPE "EconomyBillFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "EconomyClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'ADJUSTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "PeerLoanStatus" AS ENUM ('REQUESTED', 'ACTIVE', 'REPAID', 'LATE', 'DEFAULTED', 'DECLINED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommunityFundStatus" AS ENUM ('DRAFT', 'ACTIVE', 'FUNDED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EconomyLifeEventStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "FridayCheckStatus" AS ENUM ('OPEN', 'COMPLETED', 'MISSED');

-- CreateTable
CREATE TABLE "LifeAccount" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "status" "LifeAccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "openingBalanceCents" INTEGER NOT NULL DEFAULT 10000,
    "checkingCents" INTEGER NOT NULL DEFAULT 10000,
    "savingsCents" INTEGER NOT NULL DEFAULT 0,
    "emergencyCents" INTEGER NOT NULL DEFAULT 0,
    "investmentCents" INTEGER NOT NULL DEFAULT 0,
    "retirementCents" INTEGER NOT NULL DEFAULT 0,
    "totalEarnedCents" INTEGER NOT NULL DEFAULT 0,
    "totalSpentCents" INTEGER NOT NULL DEFAULT 0,
    "totalSavedCents" INTEGER NOT NULL DEFAULT 0,
    "totalGivenCents" INTEGER NOT NULL DEFAULT 0,
    "trustScore" INTEGER NOT NULL DEFAULT 70,
    "fridayStreak" INTEGER NOT NULL DEFAULT 0,
    "longestFridayStreak" INTEGER NOT NULL DEFAULT 0,
    "firstPaycheckUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "creditUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "investingUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "retirementUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "leaderboardVisible" BOOLEAN NOT NULL DEFAULT true,
    "milestoneAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeTransaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "LifeTransactionType" NOT NULL,
    "direction" "EconomyTransactionDirection" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "balanceAfterCents" INTEGER,
    "idempotencyKey" TEXT,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "counterpartyStudentId" TEXT,
    "weekNumber" INTEGER,
    "dayNumber" INTEGER,
    "createdById" TEXT,
    "automated" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LifeTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeGoal" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "category" "EconomyGoalCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "whyItMatters" TEXT,
    "targetCents" INTEGER NOT NULL,
    "savedCents" INTEGER NOT NULL DEFAULT 0,
    "targetDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "completedAt" TIMESTAMP(3),
    "publicMilestone" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomySettings" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "studentPortalEnabled" BOOLEAN NOT NULL DEFAULT true,
    "facilitatorControlsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "attendancePayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "assignmentPayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reflectionPayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lessonCompletionPayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "portfolioPayEnabled" BOOLEAN NOT NULL DEFAULT true,
    "fridayCheckEnabled" BOOLEAN NOT NULL DEFAULT true,
    "autoAddFridayCheck" BOOLEAN NOT NULL DEFAULT true,
    "billsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lifeDropsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "randomLifeEventsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "automatedEarningsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "automatedFeesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "peerGivingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "peerLendingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "communityFundsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "savingsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emergencyFundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "investingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "retirementEnabled" BOOLEAN NOT NULL DEFAULT true,
    "leaderboardEnabled" BOOLEAN NOT NULL DEFAULT true,
    "publicMilestonesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "openingBalanceCents" INTEGER NOT NULL DEFAULT 10000,
    "firstPaycheckCents" INTEGER NOT NULL DEFAULT 50000,
    "attendancePayCents" INTEGER NOT NULL DEFAULT 500,
    "assignmentPayCents" INTEGER NOT NULL DEFAULT 1000,
    "reflectionPayCents" INTEGER NOT NULL DEFAULT 500,
    "lessonCompletionPayCents" INTEGER NOT NULL DEFAULT 1000,
    "portfolioPayCents" INTEGER NOT NULL DEFAULT 1000,
    "fridayCheckBonusCents" INTEGER NOT NULL DEFAULT 500,
    "missedFridayFeeCents" INTEGER NOT NULL DEFAULT 1000,
    "overdraftFeeCents" INTEGER NOT NULL DEFAULT 1500,
    "lateBillFeeCents" INTEGER NOT NULL DEFAULT 500,
    "maxPeerLoanCents" INTEGER NOT NULL DEFAULT 5000,
    "randomLifeDropsPerWeek" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomyBill" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "studentId" TEXT,
    "category" "EconomyBillCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amountCents" INTEGER NOT NULL,
    "frequency" "EconomyBillFrequency" NOT NULL,
    "nextDueAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "autoPay" BOOLEAN NOT NULL DEFAULT false,
    "facilitatorCreated" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomyBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FridayMoneyCheck" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "status" "FridayCheckStatus" NOT NULL DEFAULT 'OPEN',
    "reviewedChecking" BOOLEAN NOT NULL DEFAULT false,
    "reviewedSavings" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBills" BOOLEAN NOT NULL DEFAULT false,
    "reviewedLoans" BOOLEAN NOT NULL DEFAULT false,
    "reviewedGoal" BOOLEAN NOT NULL DEFAULT false,
    "movedToSavingsCents" INTEGER NOT NULL DEFAULT 0,
    "donatedCents" INTEGER NOT NULL DEFAULT 0,
    "smartestDecision" TEXT,
    "biggestSurprise" TEXT,
    "nextMoneyMove" TEXT,
    "completedAt" TIMESTAMP(3),
    "feeAppliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FridayMoneyCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomyClaim" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "claimType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "explanation" TEXT,
    "requestedCents" INTEGER NOT NULL,
    "approvedCents" INTEGER,
    "skill" TEXT,
    "status" "EconomyClaimStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomyClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerLoan" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "lenderStudentId" TEXT NOT NULL,
    "borrowerStudentId" TEXT NOT NULL,
    "principalCents" INTEGER NOT NULL,
    "repaymentCents" INTEGER NOT NULL,
    "amountRepaidCents" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3),
    "status" "PeerLoanStatus" NOT NULL DEFAULT 'REQUESTED',
    "borrowerNote" TEXT,
    "lenderNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "repaidAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityFund" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "goalCents" INTEGER NOT NULL,
    "raisedCents" INTEGER NOT NULL DEFAULT 0,
    "matchingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "matchLimitCents" INTEGER,
    "matchedCents" INTEGER NOT NULL DEFAULT 0,
    "status" "CommunityFundStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT,
    "closesAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityFundContribution" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityFundContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomyLifeEvent" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "emoji" TEXT,
    "story" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "choices" JSONB NOT NULL,
    "weekNumber" INTEGER,
    "scheduledFor" TIMESTAMP(3),
    "status" "EconomyLifeEventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "appliesToEveryone" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomyLifeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LifeAccount_cohortId_status_idx" ON "LifeAccount"("cohortId", "status");

-- CreateIndex
CREATE INDEX "LifeAccount_studentId_idx" ON "LifeAccount"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "LifeAccount_studentId_cohortId_key" ON "LifeAccount"("studentId", "cohortId");

-- CreateIndex
CREATE UNIQUE INDEX "LifeTransaction_idempotencyKey_key" ON "LifeTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "LifeTransaction_accountId_createdAt_idx" ON "LifeTransaction"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "LifeTransaction_type_createdAt_idx" ON "LifeTransaction"("type", "createdAt");

-- CreateIndex
CREATE INDEX "LifeTransaction_sourceType_sourceId_idx" ON "LifeTransaction"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "LifeGoal_studentId_active_idx" ON "LifeGoal"("studentId", "active");

-- CreateIndex
CREATE INDEX "LifeGoal_cohortId_active_idx" ON "LifeGoal"("cohortId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "EconomySettings_cohortId_key" ON "EconomySettings"("cohortId");

-- CreateIndex
CREATE INDEX "EconomyBill_cohortId_active_idx" ON "EconomyBill"("cohortId", "active");

-- CreateIndex
CREATE INDEX "EconomyBill_studentId_active_idx" ON "EconomyBill"("studentId", "active");

-- CreateIndex
CREATE INDEX "EconomyBill_nextDueAt_active_idx" ON "EconomyBill"("nextDueAt", "active");

-- CreateIndex
CREATE INDEX "FridayMoneyCheck_cohortId_weekNumber_status_idx" ON "FridayMoneyCheck"("cohortId", "weekNumber", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FridayMoneyCheck_studentId_cohortId_weekNumber_key" ON "FridayMoneyCheck"("studentId", "cohortId", "weekNumber");

-- CreateIndex
CREATE INDEX "EconomyClaim_cohortId_weekNumber_status_idx" ON "EconomyClaim"("cohortId", "weekNumber", "status");

-- CreateIndex
CREATE INDEX "EconomyClaim_studentId_status_idx" ON "EconomyClaim"("studentId", "status");

-- CreateIndex
CREATE INDEX "PeerLoan_cohortId_status_idx" ON "PeerLoan"("cohortId", "status");

-- CreateIndex
CREATE INDEX "PeerLoan_lenderStudentId_status_idx" ON "PeerLoan"("lenderStudentId", "status");

-- CreateIndex
CREATE INDEX "PeerLoan_borrowerStudentId_status_idx" ON "PeerLoan"("borrowerStudentId", "status");

-- CreateIndex
CREATE INDEX "CommunityFund_cohortId_status_idx" ON "CommunityFund"("cohortId", "status");

-- CreateIndex
CREATE INDEX "CommunityFundContribution_fundId_createdAt_idx" ON "CommunityFundContribution"("fundId", "createdAt");

-- CreateIndex
CREATE INDEX "CommunityFundContribution_studentId_idx" ON "CommunityFundContribution"("studentId");

-- CreateIndex
CREATE INDEX "EconomyLifeEvent_cohortId_status_idx" ON "EconomyLifeEvent"("cohortId", "status");

-- CreateIndex
CREATE INDEX "EconomyLifeEvent_scheduledFor_status_idx" ON "EconomyLifeEvent"("scheduledFor", "status");

-- AddForeignKey
ALTER TABLE "LifeAccount" ADD CONSTRAINT "LifeAccount_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeAccount" ADD CONSTRAINT "LifeAccount_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeTransaction" ADD CONSTRAINT "LifeTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LifeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeGoal" ADD CONSTRAINT "LifeGoal_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomySettings" ADD CONSTRAINT "EconomySettings_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomyBill" ADD CONSTRAINT "EconomyBill_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FridayMoneyCheck" ADD CONSTRAINT "FridayMoneyCheck_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FridayMoneyCheck" ADD CONSTRAINT "FridayMoneyCheck_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomyClaim" ADD CONSTRAINT "EconomyClaim_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomyClaim" ADD CONSTRAINT "EconomyClaim_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerLoan" ADD CONSTRAINT "PeerLoan_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerLoan" ADD CONSTRAINT "PeerLoan_lenderStudentId_fkey" FOREIGN KEY ("lenderStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerLoan" ADD CONSTRAINT "PeerLoan_borrowerStudentId_fkey" FOREIGN KEY ("borrowerStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityFund" ADD CONSTRAINT "CommunityFund_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityFundContribution" ADD CONSTRAINT "CommunityFundContribution_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "CommunityFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityFundContribution" ADD CONSTRAINT "CommunityFundContribution_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomyLifeEvent" ADD CONSTRAINT "EconomyLifeEvent_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

