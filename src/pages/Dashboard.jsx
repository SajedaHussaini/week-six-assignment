import React, { useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  useMediaQuery
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BoltIcon from "@mui/icons-material/Bolt";

import { useNavigate } from "react-router-dom";
import { GoalContext } from "../context/GoalContext";
import { LocaleContext } from "../context/LocaleContext";
import GoalCard from "../components/goals/GoalCard";
import ProgressChart from "../components/charts/ProgressChart";
import { useTheme } from "@mui/material/styles";

export default function Dashboard() {
  const { goals, userStats, setGoals } = useContext(GoalContext);
  const { t } = useContext(LocaleContext);
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:900px)");

  const activeGoals = useMemo(() =>
    goals.filter(g => g.status === "active"),
    [goals]);
  const completedGoals = goals.filter(g => g.status === "completed");

  const total = goals.length;
  const completedCount = completedGoals.length;
  const percent = total ? Math.round((completedCount / total) * 100) : 0;

  const theme = useTheme();

  // HANDLERS 

  const handleDelete = (goal) => {
    setGoals(goals.filter(g => g.id !== goal.id));

  };

  const handlePause = (goal) => {
    const updated = goals.map(g =>
      g.id === goal.id
        ? {
          ...g,
          status: g.status === "paused" ? "active" : "paused"
        }
        : g
    );
    setGoals(updated);
  };

  const handleMark = (goal) => {
    const updated = goals.map(g => {
      if (g.id !== goal.id) return g;

      const newProgress = Math.min(
        Number(g.target),
        (g.progress || 0) + 1
      );

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
    });

    setGoals(updated);
  };

  const handleEdit = (goal) => {
    navigate(`/goals/edit/${goal.id}`);
  };


  const categoryStats = useMemo(() => {
    const cats = {};

    goals.forEach(g => {
      if (!cats[g.category]) {
        cats[g.category] = {
          category: g.category,
          active: 0,
          completed: 0
        };
      }

      if (g.status === "active") {
        cats[g.category].active++;
      }

      if (g.status === "completed") {
        cats[g.category].completed++;
      }
    });

    return Object.values(cats);
  }, [goals]);

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"


      }}
    >

      {/* HEADER */}
      <Card
        sx={{
          mb: 0.5,
          border: "1px solid #3b82f6",
          borderRadius: 6,
          boxShadow: 3,
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box"
        }}
      >
        <CardContent sx={{
          p: { xs: 1.5, sm: 2 }
        }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: "100%",
              m: 0,
              px: 0,
              px: { xs: 0, sm: 0 }
            }}

            spacing={0}
          >

            <Grid item xs={12} md={6} sx={{ minWidth: 0, maxWidth: "100%" }}>
              <Typography variant="h5" fontWeight={600}
                fontSize={{ xs: 22, sm: 28, md: 38 }}
                mt={{ xs: 0.5, sm: 1 }} sx={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere"
                }}>
                {t("goalTracker:Dashboard") || "Goal Tracker: Dashboard"}
              </Typography>

              <Typography color="text.secondary" mt={1} mb={1} fontSize={{ xs: 13, sm: 14 }} sx={{
                wordBreak: "break-word",
                overflowWrap: "anywhere"
              }}>
                {t("trackYourProgressStayConsistentAndAchieveYourGoals") || "Track your progress, stay consistent, and achieve your goals"}
              </Typography>
            </Grid>

            <Grid sx={{ minWidth: 0, maxWidth: "100%" }} item xs={12} md="auto" mt={{ xs: 2, md: 0 }} >

              <Stack
                direction="row"
                sx={{
                  gap: { xs: 0.5, sm: 1 },
                  flexWrap: "wrap",
                  width: "100%"
                }}
              >
                <Button
                  variant="contained"
                  size={isMobile ? "small" : "medium"}
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/goals/new")}
                  sx={{
                    borderRadius: 6,
                    fontSize: { xs: 12, sm: 14 },
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 0.5, sm: 1 },
                    flex: { xs: "1 1 100%", sm: "unset" },
                    "& .MuiButton-startIcon": {
                      marginInlineStart: "0px",
                      marginInlineEnd: "8px"
                    },
                    minWidth: 0

                  }}
                >
                  {t("newGoal")}
                </Button>

                <Button
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  startIcon={<ListAltIcon />}
                  onClick={() => navigate("/goals")}
                  sx={{
                    borderRadius: 6,
                    fontSize: { xs: 12, sm: 14 },
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 0.5, sm: 1 },
                    flex: { xs: "1 1 100%", sm: "unset" },
                    "& .MuiButton-startIcon": {
                      marginInlineStart: "0px",
                      marginInlineEnd: "8px"
                    },
                    marginLeft: 0
                  }}
                >
                  {t("allGoals")}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* STATS */}
      <CardContent sx={{ px: { xs: 0.5, sm: 2 } }}>
        <Grid
          container
          spacing={{ xs: 1, sm: 2 }}
          alignItems="stretch"
          sx={{
            m: 0,
            width: "100%"
          }}
        >
          {[
            {
              icon: <EmojiEventsIcon color="primary" />,
              title: t("overallCompletion"),
              value: `${percent}%`,
              color: "primary",
            },
            {
              icon: <CheckCircleIcon color="success" />,
              title: t("completedGoals"),
              value: completedCount,
              color: "success",
            },
            {
              icon: <WhatshotIcon color="warning" />,
              title: t("currentStreak"),
              value: userStats.streak,
              color: "warning",
            },
            {
              icon: <BoltIcon sx={{ color: theme.palette.purple.main }} />,
              title: t("totalXp"),
              value: userStats.xpTotal,
              color: "purple",
            },
          ].map((item, i) => {
            const mainColor = theme.palette[item.color].main;

            return (
              <Grid
                item
                xs={6}
                sm={6}
                md={3}
                key={i}
                sx={{
                  display: "flex",
                  minWidth: 0,
                  p: "4px"
                }}
              >
                <Card
                  sx={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    width: "100%",
                    flex: 1,
                    display: "flex",
                    minWidth: 0,
                    minHeight: { xs: 90, sm: 130 },
                    height: "100%",
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${mainColor}22, ${mainColor}11)`,
                    border: `1px solid ${mainColor}33`,
                    backdropFilter: "blur(6px)",
                    transition: "0.3s",
                    boxSizing: "border-box",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 30px ${mainColor}33`,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      gap: 1,
                      p: { xs: 1, sm: 2 },
                      "& svg": {
                        fontSize: { xs: 18, sm: 24 }
                      }
                    }}
                  >
                    {item.icon}

                    <Typography
                      variant="subtitle2"
                      fontWeight={500}
                      sx={{
                        width: "100%",
                        fontSize: { xs: 11, sm: 14 }
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{
                        width: "100%",
                        fontSize: { xs: 16, sm: 22 }
                      }}
                    >
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>

      {/* ACTIVE GOALS */}
      <Card sx={{ border: "1px solid #3b82f6", borderRadius: 6, boxShadow: 3, mb: { xs: 2, sm: 3 } }}>
        <CardContent sx={{
          p: { xs: 1.5, sm: 2 }
        }}>
          <Typography variant="h6" mb={2}>
            {t("activeGoals") || "Active Goals"}
          </Typography>

          <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ m: 0, width: "100%" }}>
            {activeGoals.length === 0 && (
              <Grid item xs={12}>
                <Typography color="text.secondary">
                  {t("noActiveGoals") || "No active goals."}
                </Typography>
              </Grid>
            )}

            {activeGoals.map(goal => (
              <Grid item xs={12} md={6} key={goal.id}>
                <GoalCard
                  goal={goal}
                  onDelete={handleDelete}
                  onPause={handlePause}
                  onMark={handleMark}
                  onEdit={handleEdit}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* CHART */}
      <Card sx={{ border: "1px solid #3b82f6", borderRadius: 6, boxShadow: 3, mb: { xs: 2, sm: 3 } }}>
        <CardContent sx={{
          p: { xs: 1.5, sm: 2 }
        }}>
          <Typography variant="h6" mb={2}>
            {t("categoryProgress") || "Category Progress"}
          </Typography>

          <ProgressChart data={categoryStats.map(cs => ({
            category: cs.category,
            active: cs.active,
            completed: cs.completed
          }))}
          />
        </CardContent>
      </Card>

      {/* COMPLETED */}
      <Card sx={{ border: "1px solid #3b82f6", borderRadius: 6, boxShadow: 3, marginBottom: 2 }}>
        <CardContent sx={{
          p: { xs: 1.5, sm: 2 }
        }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontSize={{ xs: 18, sm: 19 }}>
              {t("recentlyCompleted") || "Recently Completed"}
            </Typography>

            <Button onClick={() => navigate("/archive")} sx={{ fontSize: { xs: 11, sm: 13, md: 14 } }}>
              {t("viewArchive") || "View Archive"}
            </Button>
          </Grid>

          <Grid container spacing={{ xs: 1, sm: 2 }} mt={1} sx={{ m: 0, width: "100%" }}>
            {completedGoals.slice(0, 4).map(goal => (
              <Grid sx={{ minWidth: 0 }} item xs={12} md={6} key={goal.id}>
                <GoalCard
                  goal={goal}
                  onDelete={handleDelete}
                  onPause={handlePause}
                  onMark={handleMark}
                  onEdit={handleEdit}
                />
              </Grid>
            ))}

            {completedGoals.length === 0 && (
              <Grid sx={{ minWidth: 0 }} item xs={12}>
                <Typography color="text.secondary" fontSize={{ xs: 14, sm: 16 }}>
                  {t("noCompletedGoalsYet") || "No completed goals yet"}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

    </Box>
  );
}
