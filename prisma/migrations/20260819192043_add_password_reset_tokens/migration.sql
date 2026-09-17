-- AlterTable
ALTER TABLE "PasswordResetRequest" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "tokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_tokenHash_key" ON "PasswordResetRequest"("tokenHash");

