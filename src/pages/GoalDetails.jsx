import React, { useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { GoalContext } from "../context/GoalContext";
import { LocaleContext } from "../context/LocaleContext";
import { formatDate } from "../utils/date";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import PauseIcon from "@mui/icons-material/Pause";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";

import NotesIcon from "@mui/icons-material/Notes";
import CategoryIcon from "@mui/icons-material/Category";
import FlagIcon from "@mui/icons-material/Flag";
import TimelineIcon from "@mui/icons-material/Timeline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { createNotification } from "../api/notifications";

export default function GoalDetails() {
  const { id } = useParams();
  const { goals, setGoals } = useContext(GoalContext);
  const { t } = useContext(LocaleContext);
  const navigate = useNavigate();

  const goal = goals.find(g => g.id === id);
  if (!goal) return <Typography>{t("goalNotFound") || "Gola not found."}</Typography>;

  // Idetifying RTL 
  const isRTL = t("dir") === "rtl";

  // HANDLERS
  const handleProgress = () => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;

        const newProgress = Math.min(Number(g.target), (g.progress || 0) + 1);

        // NOTIFICATION 
        if (newProgress >= g.target && g.status !== "completed") {
          createNotification({
            text: `🎉 Goal completed: ${g.title}`,
            type: "completed",

            goalId: goal.id,
            route: `/goals/${goal.id}`
          });
        }

        return {
          ...g,
          progress: newProgress,
          logs: [
            ...(g.logs || []),
            { date: new Date().toISOString(), amount: 1 }
          ],
          status: newProgress >= g.target ? "completed" : "active",
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const handlePause = () => {
    setGoals(prev =>
      prev.map(g =>
        g.id === id
          ? {
            ...g,
            status: g.status === "paused" ? "active" : "paused"
          }
          : g
      )
    );
  };

  const handleMarkComplete = () => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;

        //  NOTIFICATION 
        createNotification({
          text: `🎉 Goal completed: ${g.title}`,
          type: "completed",
          goalId: goal.id,
          route: `/goals/${goal.id}`
        });

        return {
          ...g,
          progress: Number(g.target),
          status: "completed",
          updatedAt: new Date().toISOString()
        };
      })
    );
  };


  return (
    <Box p={3} width={"100%"} mx="auto" dir={isRTL ? "rtl" : "ltr"}>

      {/* HEADER */}
      <Card sx={{ border: "1px solid #3b82f6", borderRadius: 6, mb: 2, p: 2 }}>
        <CardContent>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >

            <Box width="100%">
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography variant="h5" fontWeight={600}>
                  {goal.title}
                </Typography>

                <Typography color="text.secondary">
                  / {t(goal.category) || goal.category}
                </Typography>
              </Stack>

              {/* NOTE */}
              <Stack
                direction="row"
                spacing={1}
                mt={1}
                alignItems="flex-start"
              >
                <NotesIcon sx={{ color: "#3b82f6", mt: "2px" }} fontSize="small" />

                <Typography color="text.secondary">
                  {t("note") || "Note"}:{" "}
                  {goal.note?.trim()
                    ? goal.note
                    : goal.notes?.trim()
                      ? goal.notes
                      : t("noNote") || "No note"}
                </Typography>
              </Stack>
            </Box>

            {/* BACK BUTTON */}
            <Button
              fullWidth={{ xs: true, sm: false }}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/goals")}
              sx={{
                borderRadius: 3,
                flexDirection: isRTL ? "row-reverse" : "row",
                alignSelf: { xs: "stretch", sm: "auto" }
              }}
            >
              {t("back") || "Back"}
            </Button>

          </Stack>

        </CardContent>
      </Card>

      {/*INFO */}

      <Card sx={{ border: "1px solid #3b82f6", borderRadius: 6, mb: 2, width: "100%" }}>
        <CardContent>

          <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>

            {[
              {
                icon: <CategoryIcon sx={{ color: "#3b82f6" }} />,
                label: t("type") || "Type",
                value: goal.type,
                color: "#3b82f6"
              },
              {
                icon: <FlagIcon sx={{ color: "#10b981" }} />,
                label: t("target") || "Target",
                value: goal.target,
                color: "#10b981"
              },
              {
                icon: <TimelineIcon sx={{ color: "#f59e0b" }} />,
                label: t("progress") || "Progress",
                value: `${goal.progress}/${goal.target}`,
                color: "#f59e0b"
              },
              {
                icon: <AssignmentTurnedInIcon sx={{ color: "#6366f1" }} />,
                label: t("status") || "Status",
                value: goal.status,
                color: "#6366f1"
              },
              {
                icon: <CalendarTodayIcon sx={{ color: "#ef4444" }} />,
                label: t("created") || "Created",
                value: formatDate(goal.createdAt),
                color: "#ef4444"
              }
            ].map((item, i) => (
              <Grid
                item
                key={i}
                xs={6}
                sm={6}
                md={i === 4 ? 12 : 6}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    p: 2,
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
                    }
                  }}
                >
                  {item.icon}

                  <Typography
                    variant="caption"
                    sx={{ color: item.color, fontWeight: 600, fontSize: 15 }}
                  >
                    {item.label}
                  </Typography>

                  {item.label !== (t("status") || "Status") && (
                    <Typography fontWeight={700}>
                      {item.value}
                    </Typography>
                  )}

                  {item.label === (t("status") || "Status") && (
                    <Chip
                      size="small"
                      label={goal.status}
                      color={
                        goal.status === "completed"
                          ? "success"
                          : goal.status === "paused"
                            ? "warning"
                            : "primary"
                      }
                      sx={{ mt: 1, textTransform: "capitalize" }}
                    />
                  )}
                </Card>
              </Grid>
            ))}

          </Grid>

        </CardContent>
      </Card>

      {/*ACTION BUTTONS */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        flexWrap="wrap"
        sx={{
          mb: 2,
          "& .MuiButton-root": {
            minWidth: 140,
            gap: 1,
            whiteSpace: "nowrap"
          }
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleProgress}
          disabled={goal.status !== "active"}
          sx={{
            borderRadius: 3,
            flexDirection: isRTL ? "row-reverse" : "row"
          }}
        >
          {t("addProgress") || "Add Progress"}
        </Button>

        <Button
          variant="outlined"
          startIcon={<PauseIcon />}
          onClick={handlePause}
          disabled={goal.status === "completed"}
          sx={{
            borderRadius: 3,
            flexDirection: isRTL ? "row-reverse" : "row"
          }}
        >
          {goal.status === "paused"
            ? t("resume") || "Resume"
            : t("pause") || "Pause"}
        </Button>

        <Button
          variant="outlined"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleMarkComplete}
          disabled={goal.status === "completed"}
          sx={{
            borderRadius: 3,
            flexDirection: isRTL ? "row-reverse" : "row"
          }}
        >
          {t("markComplete") || "Mark Complete"}
        </Button>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/goals/edit/${id}`)}
          sx={{
            borderRadius: 3,
            flexDirection: isRTL ? "row-reverse" : "row"
          }}
        >
          {t("edit") || "Edit"}
        </Button>
      </Stack>
      
      {/*LOGS */}
      <Card
        sx={{
          border: "1px solid #3b82f6",
          borderRadius: 6,
          height: 320,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <CardContent sx={{ overflowY: "auto", flex: 1 }}>

          <Typography variant="h6" mb={2}>
            {t("progressHistory") || "Progress History"}
          </Typography>

          <Divider sx={{ mb: 1 }} />

          <List>
            {(!goal.logs || goal.logs.length === 0) && (
              <ListItem>
                <ListItemText primary={t("noLogs") || "No logs yet."} />
              </ListItem>
            )}

            {goal.logs?.map((log, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={formatDate(log.date)}
                  secondary={`+${log.amount}`}
                />
              </ListItem>
            ))}
          </List>

        </CardContent>
      </Card>
    </Box>
  );
}
