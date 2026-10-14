-- Nullable additive fields preserve all existing public assessment records.
ALTER TABLE "PublicAssessmentSubmission"
 ADD COLUMN "careerClaimHash" TEXT,
 ADD COLUMN "careerProfile" JSONB,
 ADD COLUMN "careerRecommendations" JSONB,
 ADD COLUMN "careerCompletedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "PublicAssessmentSubmission_careerClaimHash_key"
 ON "PublicAssessmentSubmission"("careerClaimHash");
