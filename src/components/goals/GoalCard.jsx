import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  Button,
  Stack,
  Fade
} from "@mui/material";

import {
  CheckCircle,
  Edit,
  Pause,
  PlayArrow,
  Delete,
  Visibility,
  WarningAmber
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { LocaleContext } from "../../context/LocaleContext";
import { useTheme } from "@mui/material/styles";

const formatDate = (date) => {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().slice(0, 10);
  } catch {
    return "-";
  }
};

export default function GoalCard({
  goal,
  onMark,
  onEdit,
  onPause,
  onDelete,
  onRestore,
  archiveMode = false,
  onPermanentDelete,
  sx
}) {
  const navigate = useNavigate();
  const { t } = useContext(LocaleContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [confirmDelete, setConfirmDelete] = useState(false);
  const isFa = t("dir") === "rtl";

  const progress = Math.min(
    100,
    Math.round((goal.progress / goal.target) * 100)
  );

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        overflow: "hiden",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 4,
        border: "1px solid #e5e7eb",


        background: isDark ? "#1e1e1e" : "#fff",
        color: isDark ? "#fff" : "inherit",

        transition: "0.3s",
        "&:hover": {
          boxShadow: isDark
            ? "0 10px 25px rgba(26, 4, 4, 0.08)"
            : "0 10px 25px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)"
        },
        ...sx
      }}
    >
      {/* DELETE OVERLAY */}
      <Fade in={confirmDelete}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4
          }}
        >
          <Box
            sx={{
              background: isDark ? "#2a2a2a" : "#ffffff",
              p: 2,
              borderRadius: 3,
              width: "90%",
              textAlign: "center",
              color: isDark ? "#fff" : "inherit"
            }}
          >
            <WarningAmber color="error" />
            <Typography mt={1}>
              {t("areYouSureYouWantToDeleteThisGoal") ||
                "Are you sure you want to delete this goal?"}
            </Typography>

            <Stack direction="row" gap={1} mt={2} justifyContent="center">
              <Button onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
              }}>
                {t("cancel") || "Cancel"}
              </Button>

              <Button
                variant="contained"
                color="error"

                onClick={(e) => {
                  e.stopPropagation();

                  if (archiveMode && goal.status === "deleted") {
                    onPermanentDelete?.(goal);
                  } else {
                    onDelete?.(goal);
                  }

                  setConfirmDelete(false);
                }}
              >
                {t("delete") || "Delete"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* HEADER */}
        <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
          <Typography fontWeight={600}>{goal.title}</Typography>

          <Chip
            label={t(goal.category) || goal.category}
            size="small"
            color="primary"
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              height: { xs: 20, sm: 24 },
              "& .MuiChip-label": {
                px: { xs: 0.5, sm: 1 }
              }
            }}
          />

          <Chip
            label={t(goal.status) || goal.status}
            size="small"
            color={
              goal.status === "completed"
                ? "success"
                : goal.status === "paused"
                  ? "warning"
                  : goal.status === "deleted"
                    ? "error"
                    : "info"
            }
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              height: { xs: 20, sm: 24 },
              "& .MuiChip-label": {
                px: { xs: 0.5, sm: 1 }
              }
            }}
          />
        </Box>

        {/* INFO */}
        <Typography
          variant="caption"
          color={isDark ? "#b5b5b5" : "text.secondary"}
        >
          {t("type") || "Type"}: {goal.type}
        </Typography>

        <Typography
          variant="caption"
          display="block"
          color={isDark ? "#b5b5b5" : "text.secondary"}
        >
          {t("startDate") || "Start"}: {formatDate(goal.startDate)} <br />
          {t("endDate") || "End"}: {formatDate(goal.endDate)}
        </Typography>

        {/* NOTE */}
        {goal.notes && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: isDark ? "#cfcfcf" : "text.secondary",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {t("note") || "Note"}: {goal.notes}
          </Typography>
        )}

        {/* PROGRESS */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <LinearProgress
            value={progress}
            variant="determinate"
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 5
            }}
          />
          <Typography variant="caption">
            {goal.progress}/{goal.target}
          </Typography>
        </Box>

        {/* PUSH TO BOTTOM */}
        <Box sx={{ flexGrow: 1 }} />

        {!archiveMode && (
          <>
            <Stack direction="row" mt={2} gap={1} sx={{ width: "100%" }}>
              <Button
                fullWidth
                size="small"
                startIcon={<Edit />}
                variant="outlined"
                onClick={() => onEdit?.(goal)}
                sx={{
                  borderRadius: 6,
                  gap: "6px",
                  direction: isFa ? "rtl" : "ltr",
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  padding: { xs: "4px 6px", sm: "5px 5px" },
                  "& .MuiButton-startIcon": {
                    marginInline: 0,
                    "& svg": {
                      fontSize: { xs: "13px", sm: "18px" }
                    }
                  }
                }}
              >
                {t("edit") || "Edit"}
              </Button>

              <Button
                fullWidth
                size="small"
                startIcon={goal.status === "paused" ? <PlayArrow /> : <Pause />}
                variant="outlined"
                color="warning"
                disabled={goal.status === "completed"}
                onClick={() => onPause?.(goal)}
                sx={{
                  borderRadius: 6,
                  gap: "6px",
                  direction: isFa ? "rtl" : "ltr",
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  padding: { xs: "4px 6px", sm: "5px 5px" },
                  "& .MuiButton-startIcon": {
                    marginInline: 0,
                    "& svg": {
                      fontSize: { xs: "13px", sm: "18px" }
                    }
                  }
                }}
              >
                {goal.status === "paused"
                  ? t("resume") || "Resume"
                  : t("pause") || "Pause"}
              </Button>

              <Button
                fullWidth
                size="small"
                startIcon={<Delete />}
                variant="outlined"
                color="error"
                onClick={() => setConfirmDelete(true)}
                sx={{
                  borderRadius: 6,
                  gap: "6px",
                  direction: isFa ? "rtl" : "ltr",
                  fontSize: { xs: "0.6rem", sm: "0.6rem" },
                  padding: { xs: "4px 6px", sm: "5px 5px" },
                  "& .MuiButton-startIcon": {
                    marginInline: 0,
                    "& svg": {
                      fontSize: { xs: "13px", sm: "18px" }
                    }
                  }
                }}
              >
                {t("delete") || "Delete"}
              </Button>
            </Stack>

            <Stack direction="row" mt={1} gap={1} sx={{ width: "100%" }}>
              <Button
                fullWidth
                size="small"
                startIcon={<CheckCircle />}
                variant="contained"
                color="success"
                onClick={() => onMark?.(goal)}
                disabled={goal.status !== "active"}
                sx={{
                  borderRadius: 6,
                  gap: "6px",
                  direction: isFa ? "rtl" : "ltr",
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  padding: { xs: "4px 6px", sm: "5px 5px" },
                  "& .MuiButton-startIcon": {
                    marginInline: 0,
                    "& svg": {
                      fontSize: { xs: "13px", sm: "18px" }
                    }
                  }
                }}
              >
                {t("complete") || "Complete"}
              </Button>

              <Button
                fullWidth
                size="small"
                startIcon={<Visibility />}
                variant="contained"
                onClick={() => navigate(`/goals/${goal.id}`)}
                sx={{
                  borderRadius: 6,
                  gap: "6px",
                  direction: isFa ? "rtl" : "ltr",
                  fontSize: { xs: "0.6rem", sm: "0.7rem" },
                  padding: { xs: "4px 6px", sm: "5px 5px" },
                  "& .MuiButton-startIcon": {
                    marginInline: 0,
                    "& svg": {
                      fontSize: { xs: "13px", sm: "18px" }
                    }
                  }
                }}
              >
                {t("details") || "Details"}
              </Button>

            </Stack>
          </>
        )}

        {archiveMode && goal.status === "completed" && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<PlayArrow />}
            onClick={() => onRestore?.(goal)}
            sx={{
              mt: 2,
              borderRadius: 6,
              direction: isFa ? "rtl" : "ltr",
              fontSize: { xs: "0.6rem", sm: "0.7rem" },
              padding: { xs: "4px 6px", sm: "5px 5px" },
              "& .MuiButton-startIcon": {
                marginInline: 0,
                "& svg": {
                  fontSize: { xs: "13px", sm: "18px" }
                }
              }

            }}
          >
            {t("restoreToActive") || "Restore to Active"}
          </Button>
        )}

        {archiveMode && goal.status === "deleted" && (

          <Stack direction="row" mt={2} gap={1}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={() => onRestore?.(goal)}
              sx={{
                borderRadius: 6,
                direction: isFa ? "rtl" : "ltr",
                fontSize: { xs: "0.6rem", sm: "0.7rem" },
                padding: { xs: "4px 6px", sm: "5px 5px" },
                "& .MuiButton-startIcon": {
                  marginInline: 0,
                  "& svg": {
                    fontSize: { xs: "13px", sm: "18px" }
                  }
                }
              }}
            >
              {t("undoDelete") || "Undo Delete"}
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setConfirmDelete(true)}
              sx={{
                borderRadius: 6,
                direction: isFa ? "rtl" : "ltr",
                fontSize: { xs: "0.6rem", sm: "0.7rem" },
                padding: { xs: "4px 6px", sm: "5px 5px" },
                "& .MuiButton-startIcon": {
                  marginInline: 0,
                  "& svg": {
                    fontSize: { xs: "13px", sm: "18px" }
                  }
                }
              }}
            >
              {t("delete") || "Delete"}
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
