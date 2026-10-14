-- Additive toolkit tables only. Apply deliberately to a preview database first.
BEGIN;
CREATE TABLE IF NOT EXISTS "Build6ToolkitLicense" (
 "id" text PRIMARY KEY, "email" text NOT NULL UNIQUE, "name" text NOT NULL,
 "productId" text NOT NULL DEFAULT 'teamwork-communication-v1',
 "paymentReference" text NOT NULL UNIQUE, "amountCents" integer NOT NULL CHECK ("amountCents"=9900),
 "paymentVerifiedBy" text NOT NULL REFERENCES "User"("id"),
 "status" text NOT NULL DEFAULT 'INVITED' CHECK ("status" IN ('INVITED','ACTIVE','SUSPENDED','REFUNDED')),
 "passwordHash" text, "inviteHash" text UNIQUE, "inviteExpires" timestamptz,
 "termsVersion" text, "acceptedAt" timestamptz, "emailVerifiedAt" timestamptz,
 "sessionVersion" integer NOT NULL DEFAULT 1, "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "Build6ToolkitEvent" (
 "id" text PRIMARY KEY, "licenseId" text NOT NULL REFERENCES "Build6ToolkitLicense"("id"),
 "actorId" text, "event" text NOT NULL, "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "Build6ToolkitEvent_license_date" ON "Build6ToolkitEvent"("licenseId","createdAt");
CREATE TABLE IF NOT EXISTS "Build6ToolkitAttempt" ("key" text PRIMARY KEY,"count" integer NOT NULL,"windowStart" timestamptz NOT NULL DEFAULT now());
COMMIT;
