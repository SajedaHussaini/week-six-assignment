import { subDays, isSameDay, parseISO } from "date-fns";

export function calculateStreak(logs = []) {
  if (!Array.isArray(logs) || logs.length === 0) return 0;

  let streak = 0;
  let day = new Date();

  while (true) {
    const exists = logs.some(log =>
      log?.date && isSameDay(parseISO(log.date), day)
    );

    if (!exists) break;

    streak++;
    day = subDays(day, 1);
  }

  return streak;
}
