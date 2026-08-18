-- Future Ready™ Daily Recognition Badge Engine
-- Allows the same recognition badge to be awarded to a student more than once.

DROP INDEX IF EXISTS "BadgeAward_badgeId_studentId_key";

CREATE INDEX IF NOT EXISTS
  "BadgeAward_badgeId_studentId_idx"
ON "BadgeAward"("badgeId", "studentId");

CREATE INDEX IF NOT EXISTS
  "BadgeAward_studentId_awardedAt_idx"
ON "BadgeAward"("studentId", "awardedAt");

CREATE INDEX IF NOT EXISTS
  "BadgeAward_awardedAt_idx"
ON "BadgeAward"("awardedAt");

-- Global Future Ready™ recognition badge catalog.
-- programId is intentionally NULL so approved programs may use the
-- recognition system without duplicating the badge definitions.

INSERT INTO "Badge"
(
  "id",
  "programId",
  "name",
  "slug",
  "description",
  "criteria",
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES
(
  'badge_recognition_communication',
  NULL,
  'Effective Communicator',
  'effective-communicator',
  'Recognizes clear, confident, professional, or thoughtful communication.',
  '{"category":"RECOGNITION","icon":"💬","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_leadership',
  NULL,
  'Emerging Leader',
  'emerging-leader',
  'Recognizes leadership, positive influence, ownership, or helping others succeed.',
  '{"category":"RECOGNITION","icon":"⭐","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_teamwork',
  NULL,
  'Team Player',
  'team-player',
  'Recognizes collaboration, reliability, listening, and contribution to the team.',
  '{"category":"RECOGNITION","icon":"🤝","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_initiative',
  NULL,
  'Takes Initiative',
  'takes-initiative',
  'Recognizes a student who steps forward, takes ownership, or acts without being asked.',
  '{"category":"RECOGNITION","icon":"⚡","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_problem_solver',
  NULL,
  'Problem Solver',
  'problem-solver',
  'Recognizes critical thinking, resourcefulness, and solution-oriented thinking.',
  '{"category":"RECOGNITION","icon":"🧩","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_professional_presence',
  NULL,
  'Professional Presence',
  'professional-presence',
  'Recognizes professionalism, preparation, confidence, etiquette, and workplace readiness.',
  '{"category":"RECOGNITION","icon":"💼","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_adaptability',
  NULL,
  'Adaptability',
  'adaptability',
  'Recognizes flexibility, resilience, learning from feedback, and adjusting to change.',
  '{"category":"RECOGNITION","icon":"🔄","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_growth',
  NULL,
  'Growth Mindset',
  'growth-mindset',
  'Recognizes persistence, improvement, reflection, and willingness to keep learning.',
  '{"category":"RECOGNITION","icon":"🌱","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_career_explorer',
  NULL,
  'Career Explorer',
  'career-explorer',
  'Recognizes curiosity, thoughtful career exploration, and connection to future pathways.',
  '{"category":"RECOGNITION","icon":"🧭","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_community_connector',
  NULL,
  'Community Connector',
  'community-connector',
  'Recognizes relationship building, networking, inclusion, and meaningful connection.',
  '{"category":"RECOGNITION","icon":"🔗","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
),
(
  'badge_recognition_future_ready',
  NULL,
  'Future Ready™ Champion',
  'future-ready-champion',
  'Special recognition for demonstrating multiple Future Ready™ behaviors at a high level.',
  '{"category":"RECOGNITION","icon":"🏆","daily":true}'::jsonb,
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO NOTHING;
