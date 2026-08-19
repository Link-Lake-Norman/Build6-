CREATE TABLE "PasswordResetRequest" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "userId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "handledAt" TIMESTAMP(3),
  "handledById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PasswordResetRequest_status_requestedAt_idx"
ON "PasswordResetRequest"("status", "requestedAt");

CREATE INDEX "PasswordResetRequest_email_status_idx"
ON "PasswordResetRequest"("email", "status");

CREATE INDEX "PasswordResetRequest_userId_status_idx"
ON "PasswordResetRequest"("userId", "status");
