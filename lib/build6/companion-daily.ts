export const BUILD6_DAILY_TIME_ZONE = "America/New_York";
export const BUILD6_DAILY_NOTIFICATION_PREFIX = "BUILD6_DAILY_FOCUS:";

type MessageSignals = {
  firstName: string;
  strength?: string | null;
  value?: string | null;
  skill?: string | null;
  goal?: string | null;
  upcomingExperienceTitle?: string | null;
  upcomingExperienceDate?: Date | null;
};

function firstSignal(value?: string | null) {
  if (!value?.trim()) return "";

  return (
    value
      .split(/[\n,;|]+/)
      .map((item) => item.trim())
      .filter(Boolean)[0] ?? ""
  );
}

export function newYorkClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUILD6_DAILY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    hour: Number(values.hour),
  };
}

export function formatExperienceDate(value?: Date | null) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: BUILD6_DAILY_TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(value);
}

export function buildDailyFocusMessage({
  firstName,
  strength,
  value,
  skill,
  goal,
  upcomingExperienceTitle,
  upcomingExperienceDate,
}: MessageSignals) {
  const cleanStrength = firstSignal(strength);
  const cleanValue = firstSignal(value);
  const cleanSkill = firstSignal(skill);
  const cleanGoal = firstSignal(goal);

  if (upcomingExperienceTitle && upcomingExperienceDate && cleanSkill) {
    return `${firstName}, ${upcomingExperienceTitle} is coming up ${formatExperienceDate(
      upcomingExperienceDate,
    )}. Use today to practice ${cleanSkill}. Pay attention to one moment that shows how you are growing.`;
  }

  if (cleanStrength && cleanValue) {
    return `${firstName}, use your ${cleanStrength} today in a way that reflects ${cleanValue}. Notice one real example you could later use to explain who you are becoming.`;
  }

  if (cleanSkill && cleanGoal) {
    return `${firstName}, practice ${cleanSkill} today with your goal of ${cleanGoal} in mind. Small repetitions become evidence of growth.`;
  }

  if (cleanStrength) {
    return `${firstName}, put your ${cleanStrength} to work today. Notice where it helps you communicate, lead, solve a problem, or support someone else.`;
  }

  if (cleanValue) {
    return `${firstName}, let ${cleanValue} guide one decision today. The choices you repeat become part of your story.`;
  }

  if (cleanSkill) {
    return `${firstName}, look for one real opportunity to practice ${cleanSkill} today. Capture what happens in your BUILD6 Companion.`;
  }

  if (cleanGoal) {
    return `${firstName}, make one choice today that moves you closer to ${cleanGoal}. Then notice what that choice teaches you about yourself.`;
  }

  return `${firstName}, notice one moment today that says something real about who you are becoming. Capture it before you forget it.`;
}
