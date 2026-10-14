# BUILD6™ — I Challenge You Governance Standard
© Link Lake Norman, LLC — All Rights Reserved

I Challenge You is a positive skill, service, opportunity, and follow-through feature. It is not a grading system, public ranking, discipline tool, or way to expose another student's academic status.

Security and governance controls:
- authenticated students can create/manage challenges only as themselves;
- cohort challenges can target only another ACTIVE student in the same ACTIVE cohort;
- peer APIs do not expose grades, missing-work status, reflections, messages, email, phone, or portal access;
- external text/share links use a random 256-bit token; only its SHA-256 hash is stored;
- BUILD6 does not store the outside recipient's phone number;
- challenge notes are length-limited and reject phone numbers, emails, and URLs;
- challenge types are curated; no anonymous challenges and no negative points;
- decline / “not right now” is allowed without penalty;
- challenge creation and state changes write AuditLog records;
- internal cohort recipients receive only an internal notification linking to their own challenge page;
- no public leaderboard is created;
- challenge records are additive and do not delete or rewrite curriculum, assignments, submissions, reflections, capstones, portfolios, or messages;
- external share pages expose only challenge content and sender display/first name, never portal records or contact information.

Before adding unrestricted custom challenges, public rankings, direct outside-person messaging, location sharing, money/rewards, or automated external contact delivery, complete a separate privacy/security review and authorization design.

## Release Hardening V2
- Maximum 10 student-created challenges per rolling 24 hours.
- Maximum 5 external challenges per rolling 24 hours.
- Maximum 20 active sent challenges per student.
- External capability links expire after 14 days.
- Authorized staff may revoke challenges only in their permitted cohort/school/organization scope.
- Revocation clears the external capability-token hash.
- Revoked or expired challenges cannot be accepted, started, or completed.
- External recipients can accept/complete only through the capability link and never receive portal access.
- Student and moderation actions are recorded in AuditLog.
- No public student leaderboard is created.

© Link Lake Norman, LLC — All Rights Reserved
