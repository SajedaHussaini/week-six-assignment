import React, { useContext, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Stack,
  InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";

import { GoalContext } from "../context/GoalContext";
import { LocaleContext } from "../context/LocaleContext";
import ProgressChart from "../components/charts/ProgressChart";

export default function Categories() {
  const { goals } = useContext(GoalContext);
  const { t } = useContext(LocaleContext);

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("progressHigh");

  // categories
  const categoryStats = useMemo(() => {
    const categories = Array.from(new Set(goals.map(g => g.category)));

    let data = categories.map(cat => {
      const catGoals = goals.filter(g => g.category === cat);

      const active = catGoals.filter(g => g.status === "active").length;
      const completed = catGoals.filter(g => g.status === "completed").length;

      const progress =
        catGoals.length === 0
          ? 0
          : Math.round(
            catGoals.reduce(
              (acc, g) => acc +
                (g.target ? g.progress / g.target : 0)
              ,
              0
            ) / catGoals.length * 100
          );

      return {
        category: cat,
        active,
        completed,
        progress,
        total: catGoals.length
      };
    });

    // filter
    if (tab === "active") {
      data = data.filter(c => c.active > 0);
    }

    if (tab === "completed") {
      data = data.filter(c => c.completed > 0);
    }

    // search
    if (search.trim()) {
      data = data.filter(c =>
        c.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // sort
    if (sort === "progressHigh") {
      data.sort((a, b) => b.progress - a.progress);
    }

    if (sort === "progressLow") {
      data.sort((a, b) => a.progress - b.progress);
    }

    if (sort === "goals") {
      data.sort((a, b) => b.total - a.total);
    }

    if (sort === "name") {
      data.sort((a, b) => a.category.localeCompare(b.category));
    }

    return data;
  }, [goals, tab, search, sort]);

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box"
      }}
    >

      {/* HEADER */}
      <Card sx={{
        border: "1px solid #3b82f6", borderRadius: 6, mb: 2,
        px: { xs: 0.5 }
      }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} mb={1} mt={1} fontSize={{ xs: 21, sm: 24, md: 35 }}>
            {t("categories") || "Categories"}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1} mt={1} fontSize={{ xs: 15, sm: 17 }}>
            {t("trackYourGoalsBasedOnCategories") ||
              "Track your goals based on categories"}
          </Typography>
        </CardContent>
      </Card>

      {/* FILTER + SEARCH */}
      <Card sx={{
        border: "1px solid #3b82f6", borderRadius: 6, mb: 2,
        px: { xs: 0.5 }
      }}>
        <CardContent>

          <Typography fontWeight={700} mb={2}>
            {t("filter&Sorting") || "Filter & Sorting"}
          </Typography>

          {/* Tabs */}
          <Tabs value={tab} onChange={(_, v) => setTab(v)}
            variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile
            sx={{
              minHeight: { xs: 36, sm: 48 }
            }}
          >
            <Tab sx={{ minHeight: { xs: 36, sm: 48 } }} label={t("all") || "All"} value="all" />
            <Tab sx={{ minHeight: { xs: 36, sm: 48 } }} label={t("active") || "Active"} value="active" />
            <Tab sx={{ minHeight: { xs: 36, sm: 48 } }} label={t("completed") || "Completed"} value="completed" />
          </Tabs>

          <Stack direction={{ xs: "column", md: "row" }} gap={{ xs: 1.5, sm: 2 }} mt={2}>

            {/* Search */}
            <TextField
              fullWidth
              label={t("searchCategory") || "Search category"}
              value={search}
              placeholder={t("search") || "Search..."}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            {/* Sort */}
            <TextField

              fullWidth
              select sx={{ width: { xs: "100%", md: 290 } }}
              label={t("sortBy") || "Sort By"}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="progressHigh">{t("progress:HighToLow") || "Progress: High To Low"}</MenuItem>
              <MenuItem value="progressLow">{t("progress:LowToHigh") || "Progress: Low To High"}</MenuItem>
              <MenuItem value="goals">{t("goals:MostFirst") || "Goals: Most First"}</MenuItem>
              <MenuItem value="name">{t("byName") || "By Name"}</MenuItem>
            </TextField>

          </Stack>

        </CardContent>
      </Card>

      {/* CATEGORY LIST */}
      <Card sx={{
        border: "1px solid #3b82f6", borderRadius: 6, mb: 2,
        px: { xs: 0.5 }
      }}>
        <CardContent>

          <Typography fontWeight={700} mb={2} fontSize={{ xs: 16, sm: 18 }}>
            {t("allCategories") || "All Categories"}
          </Typography>

          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
            {categoryStats.length === 0 ? (
              <Grid item xs={12}>
                <Typography textAlign="center" color="text.secondary">
                  {t("noCategoryFound") || "No Category found"}
                </Typography>
              </Grid>
            ) : (
              categoryStats.map(cs => {

                const getProgressColor = () => {
                  if (cs.progress >= 75) return "#1d8b46";
                  if (cs.progress >= 40) return "#f59e0b";
                  return "#ef4444";
                };

                return (
                  <Grid item xs={12} md={6} key={cs.category}>

                    <Card
                      sx={{
                        border: "1px solid #3b82f6",
                        borderRadius: 5,
                        height: "100%",
                        transition: "all 0.3s ease",
                        cursor: "pointer",

                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "#1e293b"
                            : "#ffffff",

                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: (theme) =>
                            theme.palette.mode === "dark"
                              ? "0 15px 35px rgba(59,130,246,0.25)"
                              : "0 15px 30px rgba(59,130,246,0.15)"
                        }
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">

                          <Typography fontWeight={700} fontSize={{ xs: 14, sm: 16, md: 18 }}>
                            {cs.category}
                          </Typography>

                          <Box
                            sx={{
                              px: { xs: 1, sm: 1.8 },
                              py: { xs: 0.4, sm: 0.6 },
                              fontSize: { xs: 10, sm: 12 },
                              borderRadius: 6,

                              fontWeight: 400,
                              background: "#1a5fce",
                              color: "#fff"
                            }}
                          >
                            {cs.total} {t("goals") || "goals"}
                          </Box>

                        </Box>

                        <Box mt={2} display="flex" gap={{ xs: 1, sm: 1.5 }} flexWrap="wrap">

                          {/* ACTIVE */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: { xs: 10, sm: 12 },
                              px: { xs: 1, sm: 1.5 },
                              py: { xs: 0.4, sm: 0.6 },

                              borderRadius: 6,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontWeight: 500,
                              background: "#2b8a4e",
                              color: "#fff"
                            }}
                          >
                            <ShowChartIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            {t("active") || "Active"}: {cs.active}
                          </Box>

                          {/* COMPLETED */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              fontSize: { xs: 10, sm: 12 },
                              px: { xs: 1, sm: 1.5 },
                              py: { xs: 0.4, sm: 0.6 },
                              borderRadius: 6,
                              whiteSpace: "normal",

                              fontWeight: 400,
                              background: "#3a6cbd",
                              color: "#fff"
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                            {t("completed") || "Completed"}: {cs.completed}
                          </Box>

                        </Box>

                        <Box mt={2}>

                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <BarChartIcon sx={{ color: "#2b69ba" }} fontSize="small" />

                            <Typography fontSize={12} fontWeight={500}>
                              {t("progress1") || "Progress"}: {cs.progress}%
                            </Typography>
                          </Box>

                          <LinearProgress
                            variant="determinate"
                            value={cs.progress}
                            sx={{
                              height: { xs: 6, sm: 10 },
                              borderRadius: 5,
                              backgroundColor: "rgba(0,0,0,0.08)",

                              "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                                background: getProgressColor()
                              }
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>

        </CardContent>
      </Card>

      {/* CHART */}
      <Card sx={{
        border: "1px solid #3b82f6", borderRadius: 6,
        px: { xs: 0.5 }
      }}>
        <CardContent>

          <Typography fontWeight={700} mb={2}>
            {t("categoryProgress") || "Category Progress"}
          </Typography>

          <ProgressChart
            data={categoryStats.map(cs => ({
              category: cs.category,
              active: cs.active,
              completed: cs.completed
            }))}
          />
        </CardContent>
      </Card>

    </Box>
  );
}
