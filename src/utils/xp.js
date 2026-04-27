export function calculateXpTotal(goals = []) {
  return goals.reduce((total, goal) => {
    const logs = goal.logs || [];

    let xp = logs.length * 10;

    if (goal.status === "completed") xp += 50;

    if (goal.status === "active" && logs.length >= 7) xp += 30;

    return total + xp;
  }, 0);
}



export function calculateLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

export function xpToNextLevel(xp) {
  const level = calculateLevel(xp);
  return level * 100 - xp;
}
