-- BUILD6 Student Companion push subscription storage.
-- Additive only. Existing tables and records are not modified.

CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PushSubscription_endpoint_key"
ON "PushSubscription"("endpoint");

CREATE INDEX "PushSubscription_userId_enabled_idx"
ON "PushSubscription"("userId", "enabled");

ALTER TABLE "PushSubscription"
ADD CONSTRAINT "PushSubscription_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
