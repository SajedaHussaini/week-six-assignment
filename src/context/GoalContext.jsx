import React, { createContext, useEffect, useMemo, useState } from "react";
import { getGoals, saveGoals } from "../api/goal";
import { saveUserStats } from "../api/user";
import { calculateXpTotal } from "../utils/xp";
import { calculateStreak } from "../utils/streak";

export const GoalContext = createContext();

export function GoalsProvider({ children }) {
  // LOAD GOALS DIRECTLY AS INITIAL STATE
  const [goals, setGoals] = useState(() => {
    const storedGoals = getGoals();

    return Array.isArray(storedGoals) ? storedGoals : [];
  });

  // CALCULATE USER STATS FROM GOALS
  const userStats = useMemo(() => {
    const xpTotal = calculateXpTotal(goals);

    let allLogs = [];

    goals.forEach((g) => {
      if (Array.isArray(g.logs)) {
        allLogs = [...allLogs, ...g.logs];
      }
    });

    const streak = calculateStreak(allLogs);

    const completedCount = goals.filter(
      (g) => g.status === "completed"
    ).length;

    return {
      xpTotal,
      streak,
      completedCount
    };
  }, [goals]);

  // SAVE GOALS TO LOCAL STORAGE
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  // SAVE USER STATS TO LOCAL STORAGE
  useEffect(() => {
    saveUserStats(userStats);
  }, [userStats]);

  return (
    <GoalContext.Provider
      value={{
        goals,
        setGoals,
        userStats
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}
