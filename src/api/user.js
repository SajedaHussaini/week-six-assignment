const USER_STATS_KEY = "userStats";

export function getUserStats() {
  return JSON.parse(localStorage.getItem(USER_STATS_KEY) || '{"xpTotal":0,"streak":0,"completedCount":0}');
}

export function saveUserStats(stats) {
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
}
