-- Add optional day-specific organization to existing Future Ready resources.
-- Existing records are preserved and receive NULL until assigned to a day.

ALTER TABLE "LessonResource"
ADD COLUMN "dayNumber" INTEGER;

ALTER TABLE "Assignment"
ADD COLUMN "dayNumber" INTEGER;
