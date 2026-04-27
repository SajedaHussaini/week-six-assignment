const GOALS_KEY = "goals";
export function getGoals() {
  try {
    const data = localStorage.getItem(GOALS_KEY);

    if (!data || data === "undefined") return [];

    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing goals:", error);
    return [];
  }
}

export function saveGoals(goals) {
  if (!Array.isArray(goals)) return; // it prevents from destroying data
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function addGoal(goal) {
  const all = getGoals();
  all.unshift(goal);
  saveGoals(all);
}

export function updateGoal(id, updatedProps) {
  const all = getGoals();
  const idx = all.findIndex(g => g.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updatedProps, updatedAt: new Date().toISOString() };
    saveGoals(all);
  }
}

export function deleteGoal(id) {
  const all = getGoals();
  saveGoals(all.filter(g => g.id !== id));
}
