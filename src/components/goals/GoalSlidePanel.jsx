import React, { useContext } from "react";
import {
  Card,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Stack,
  useTheme
} from "@mui/material";
import { LocaleContext } from "../../context/LocaleContext";

export default function GoalSidePanel({ watch }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useContext(LocaleContext);

  const title = watch("title");
  const category = watch("category");
  const type = watch("type");

  // fix: normalize number safely
  const target = Number(watch("target")) || 0;
  const startDate = watch("startDate");

  const categoryColors = {
    health: "#22c55e",
    study: "#3b82f6",
    work: "#f59e0b",
    personal: "#a855f7",
    financial: "#10b981",
    hobby: "#ec4899"
  };

  const normalizedCategory = (category || "").toLowerCase();

  const themeColor = categoryColors[normalizedCategory] || "#6366f1";

  // Live Progress (setup completeness)
  let progress = 0;
  if (title) progress += 25;
  if (category) progress += 20;
  if (type) progress += 20;
  if (target > 0) progress += 25;
  if (startDate) progress += 10;

  // Goal Score (same logic but safe target)
  const goalScore = () => {
    let score = 0;
    if (title) score += 30;
    if (category) score += 20;
    if (type) score += 20;
    if (target > 0) score += 20;
    if (startDate) score += 10;
    return score;
  };

  const score = goalScore();

  return (
    <Stack spacing={2}>

      {/* LIVE PREVIEW */}
      <Card
        sx={{
          p: 2,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${themeColor}, #1e293b)`,
          color: "#fff",
          boxShadow: isDark
            ? "0 10px 25px rgba(0,0,0,0.6)"
            : "0 10px 25px rgba(99,102,241,0.3)"
        }}
      >
        <Typography fontWeight={700} mb={1}>
          {t("livePreview") || "Live Preview"}
        </Typography>

        <Typography variant="h6">
          {title || t("yourGoalTitle") || "Your goal title..."}
        </Typography>

        <Box mt={1}>
          <Chip
            label={category || t("category") || "Category"}
            size="small"
            sx={{
              background: "#fff",
              color: "#000",
              fontWeight: 500
            }}
          />
        </Box>

        <Box mt={2}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              background: "rgba(255,255,255,0.2)"
            }}
          />
        </Box>

        <Typography variant="caption">
          {progress}% {t("setupCompleted") || "setup completed"}
        </Typography>
      </Card>

      {/* GOAL SCORE */}
      <Card
        sx={{
          p: 2,
          borderRadius: 4,
          background: isDark ? "#111827" : "#fff",
          color: isDark ? "#fff" : "#000",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
        }}
      >
        <Typography fontWeight={700}>
          {t("goalScore") || "Goal Score"}
        </Typography>

        <Typography variant="h3" fontWeight={800}>
          {score}/100
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {score > 70
            ? (t("strongGoalSetup") || "Strong goal setup")
            : (t("improveYourGoalDetails") || "Improve your goal details")}
        </Typography>
      </Card>

      {/* SMART TIPS */}
      <Card
        sx={{
          p: 2,
          borderRadius: 4,
          background: isDark ? "#1e293b" : "#fff",
          color: isDark ? "#e2e8f0" : "#000",
          boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
        }}
      >
        <Typography fontWeight={700} mb={1}>
          {t("smartTips") || "Smart Tips"}
        </Typography>

        {!title && (
          <Typography variant="body2">
            {t("addAClearAndSpecificTitle") || "Add a clear and specific title"}
          </Typography>
        )}

        {target <= 0 && (
          <Typography variant="body2">
            {t("addATargetToMakeYourGoalMeasurable") ||
              "Add a target to make your goal measurable"}
          </Typography>
        )}

        {type === "daily" && (
          <Typography variant="body2">
            {t("dailyGoalsWorkBestWithConsistency") ||
              "Daily goals work best with consistency"}
          </Typography>
        )}

        {category === "Health" && (
          <Typography variant="body2">
            {t("trackYourHabitsDailyForBetterResults") ||
              "Track your habits daily for better results"}
          </Typography>
        )}

        {score > 80 && (
          <Typography variant="body2">
            {t("yourGoalIsWellStructured") || "Your goal is well structured"}
          </Typography>
        )}
      </Card>
    </Stack>
  );
}
