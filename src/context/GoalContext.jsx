import React, { createContext, useState, useEffect } from "react";
import { getGoals, saveGoals } from "../api/goal";
import { getUserStats, saveUserStats } from "../api/user";
import { calculateXpTotal } from "../utils/xp";
import { calculateStreak } from "../utils/streak";

export const GoalContext = createContext();

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [userStats, setUserStats] = useState({
    xpTotal: 0,
    streak: 0,
    completedCount: 0
  });

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const storedGoals = getGoals();
    const storedStats = getUserStats();

    if (Array.isArray(storedGoals)) {
      setGoals(storedGoals);
    }

    if (storedStats) {
      setUserStats(storedStats);
    }
    setIsHydrated(true);
  }, []);

  // SAVE GOALS TO STORAGE
  useEffect(() => {
    if (!isHydrated) return;
    saveGoals(goals);
  }, [goals, isHydrated]);

  // CALCULATE XP + STREAK
  useEffect(() => {
    if (!Array.isArray(goals)) return;

    // XP
    const xpTotal = calculateXpTotal(goals);

    // collect all logs
    let allLogs = [];
    goals.forEach(g => {
      if (Array.isArray(g.logs)) {
        allLogs = [...allLogs, ...g.logs];
      }
    });

    // STREAK
    const streak = calculateStreak(allLogs);

    // COMPLETED COUNT
    const completedCount = goals.filter(
      g => g.status === "completed"
    ).length;

    const newStats = {
      xpTotal,
      streak,
      completedCount
    };

    setUserStats(newStats);
    saveUserStats(newStats);
  }, [goals]);

  return (
    <GoalContext.Provider
      value={{
        goals,
        setGoals,
        userStats,
        setUserStats
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}
