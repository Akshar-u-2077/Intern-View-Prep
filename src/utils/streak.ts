export interface StreakState {
  streakCurrent: number;
  streakLongest: number;
  lastActiveDate: string;
}

const formatDateKey = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeDateKey = (value: string | null | undefined): string => {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';

  return formatDateKey(parsed);
};

export function calculateStreakState(activeDates: string[] = [], fallbackLastActiveDate?: string): StreakState {
  const uniqueDates = Array.from(
    new Set(
      activeDates
        .map(normalizeDateKey)
        .filter(Boolean)
        .sort()
    )
  );

  if (uniqueDates.length === 0) {
    const fallbackDate = normalizeDateKey(fallbackLastActiveDate || new Date().toISOString()) || formatDateKey(new Date());
    return { streakCurrent: 0, streakLongest: 0, lastActiveDate: fallbackDate };
  }

  let longestRun = 1;
  let currentRun = 1;
  let previousDate: Date | null = null;

  for (const dateKey of uniqueDates) {
    const currentDate = new Date(`${dateKey}T00:00:00Z`);

    if (!previousDate) {
      previousDate = currentDate;
      continue;
    }

    const diffDays = Math.round((currentDate.getTime() - previousDate.getTime()) / 86400000);

    if (diffDays === 1) {
      currentRun += 1;
      longestRun = Math.max(longestRun, currentRun);
    } else {
      currentRun = 1;
    }

    previousDate = currentDate;
  }

  let recentStreak = 1;
  let cursor = new Date(`${uniqueDates[uniqueDates.length - 1]}T00:00:00Z`);

  while (true) {
    const previousDay = new Date(cursor);
    previousDay.setUTCDate(previousDay.getUTCDate() - 1);
    const previousKey = formatDateKey(previousDay);

    if (!uniqueDates.includes(previousKey)) break;

    recentStreak += 1;
    cursor = previousDay;
  }

  return {
    streakCurrent: recentStreak,
    streakLongest: longestRun,
    lastActiveDate: uniqueDates[uniqueDates.length - 1],
  };
}
