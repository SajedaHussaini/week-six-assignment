import React, { useContext, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  TextField,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Stack,
  InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";

import { GoalContext } from "../context/GoalContext";
import GoalCard from "../components/goals/GoalCard";
import { useNavigate } from "react-router-dom";
import { LocaleContext } from "../context/LocaleContext";

import { useEffect } from "react";
import { getNotifications, createNotification } from "../api/notifications";

import {
  exportGoalsToJSON,
  exportGoalsToCSV
} from "../utils/export";

const STATUS_FILTERS = (t) => [
  { label: t("all") || "All", value: "all" },
  { label: t("active") || "Active", value: "active" },
  { label: t("completed") || "Completed", value: "completed" },
  { label: t("paused") || "Paused", value: "paused" }
];

const SORT_OPTIONS = (t) => [
  { label: t("newest") || "Newest", value: "newest" },
  { label: t("progress") || "Progress %", value: "progress" },
  { label: t("category") || "Category", value: "category" }
];

export default function GoalList() {
  const { goals, setGoals } = useContext(GoalContext);
  const navigate = useNavigate();
  const { t } = useContext(LocaleContext);

  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [exportAnchor, setExportAnchor] = useState(null);

  //DEADLINE NOTIFICATION//
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();

      goals.forEach(g => {
        if (!g.endDate || g.status === "completed") return;

        const diffDays =
          (new Date(g.endDate) - today) / (1000 * 60 * 60 * 24);

        if (diffDays > 0 && diffDays <= 2) {
          const existing = getNotifications();

          const alreadySent = existing.some(
            n => n.type === "deadline" && n.goalId === g.id
          );

          if (!alreadySent) {
            createNotification({
              text: `⏰ Deadline soon: ${g.title}`,
              type: "deadline",
              goalId: g.id
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [goals]);


  // EXPORT
  const handleExportOpen = (e) => setExportAnchor(e.currentTarget);
  const handleExportClose = () => setExportAnchor(null);

  const handleExportJSON = () => {
    exportGoalsToJSON(goals);
    handleExportClose();
  };

  const handleExportCSV = () => {
    exportGoalsToCSV(goals);
    handleExportClose();
  };


  // DELETE
  const handleDelete = (goal) => {
    setGoals(prev =>
      prev.map(g =>
        g.id === goal.id
          ? { ...g, status: "deleted", updatedAt: new Date().toISOString() }
          : g
      )
    );

    createNotification({
      text: `🗑️ Goal deleted: ${goal.title}`,
      type: "goal_deleted",
      goalId: goal.id,
      route: "/archive"
    });
  };


  // PAUSE / RESUME
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


  // PROGRESS \\
  const handleMark = (goal) => {
    const updated = goals.map(g => {
      if (g.id !== goal.id) return g;

      const newProgress = Math.min(
        Number(g.target),
        (g.progress || 0) + 1
      );

      if (newProgress >= g.target && g.status !== "completed") {
        createNotification({
          text: `🎉 Goal completed: ${g.title}`,
          type: "completed",
          goalId: g.id,
          route: `/goals/${g.id}`
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
    });

    setGoals(updated);
  };

  //  EDIT
  const handleEdit = (goal) => {
    navigate(`/goals/edit/${goal.id}`);
  };


  // FILTER
  const filteredGoals = useMemo(() => {
    let data = [...goals];

    data = data.filter(g => g.status !== "deleted");

    if (status !== "all") {
      data = data.filter(g => g.status === status);
    }

    if (search.trim()) {
      data = data.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sort === "progress") {
      data.sort(
        (a, b) =>
          ((b.progress / b.target) || 0) -
          ((a.progress / a.target) || 0)
      );
    }

    if (sort === "category") {
      data.sort((a, b) =>
        (a.category || "").localeCompare(b.category || "")
      );
    }

    return data;
  }, [goals, status, search, sort]);


  // STATS
  const allCount = goals.length;
  const activeCount = goals.filter(g => g.status === "active").length;
  const completedCount = goals.filter(g => g.status === "completed").length;
  const pausedCount = goals.filter(g => g.status === "paused").length;

  const avgProgress =
    goals.length === 0
      ? 0
      : Math.round(
        (goals.reduce(
          (acc, g) => acc + ((g.progress / g.target) || 0),
          0
        ) /
          goals.length) *
        100
      );

  const statCardStyle = {
    border: "1px solid #3b82f6",
    borderRadius: 3,
    boxShadow: "0 4px 15px rgba(59,130,246,0.15)",
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    padding: "12px",
    minHeight: 80
  };

  const isFa = t("dir") === "rtl";

  return (
    <Box
  p={{ xs: 1.5, sm: 2, md: 3 }}
  sx={{
    width: "100%",
    maxWidth: "100vw"
  }}
>
      {/* HEADER */}
      <Card sx={{ border: "1px solid #3b82f6", borderRadius: 6, mb: 2, }}>
        <CardContent>
          <Stack
  direction={{ xs: "column", md: "row" }}
  justifyContent="space-between"
  alignItems={{ xs: "flex-start", md: "center" }}
  gap={2}
>

            <Box>
              <Typography
  variant="h4"
  fontWeight={700}
  mt={1}
  mb={1}
  sx={{ fontSize: { xs: "20px", md: "32px" } }}
>
                {/* All Goals */}
                {t("allGoals") || "All Goals"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1} sx={{ fontSize: { xs: "14px", md: "16px" } }}>
                {t("trackManageAndCompleteYourPersonalGoalsEfficiently") || "Track, manage and complete your personal goals efficiently"}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              width={{xs:"100%", md:"auto"}}
              gap={1}
              flexWrap="wrap"
              sx={{
                direction: isFa ? "rtl" : "ltr",
                "& > *": {
                  marginLeft: isFa ? "0 !important" : undefined,
                  marginRight: isFa ? "8px" : undefined
                }
              }}
            >
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                
                onClick={() => navigate("/goals/new")}
                size="medium"
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
                width={{xs:"100%", md:"auto"}}
              >
                {/* New Goal */}
                {t("newGoal") || "New Goal"}
              </Button>


              <Button
                startIcon={<FileDownloadIcon />}
                variant="outlined"
                onClick={handleExportOpen}
                size="medium"
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
                width={{xs:"100%", md:"auto"}}
              >
                {t("export") || "EXPORT"}
              </Button>

              <Menu
                anchorEl={exportAnchor}
                open={Boolean(exportAnchor)}
                onClose={handleExportClose}
              >
                <MenuItem onClick={handleExportJSON}>{t("exportJson") || "Export JSON"}</MenuItem>
                <MenuItem onClick={handleExportCSV}>{t("exportCsv") || "Export CSV"}</MenuItem>
              </Menu>
            </Stack>

          </Stack>
        </CardContent>
      </Card>

      {/* STATS */}
      <Grid
  container
  spacing={1}
  mb={2}
  sx={{ width: "100%", mx: 0,
     "& > .MuiGrid-item": {
    paddingLeft: "4px",
    paddingRight: "4px"
  } 
}}
  justifyContent={{ xs: "center", md: "flex-start" }}
>

        {/* ALL */}
        <Grid item xs={4} md={3} >
          <Card sx={{ ...statCardStyle, minHeight: {xs:80, sm:110}, width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box" }}>
            <Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <ListAltIcon color="primary"  sx={{ fontSize: { xs: 18, sm: 24 } }}/>
                <Typography variant="body2" sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>{t("all") || "All"}</Typography>
              </Box>
              <Typography fontWeight={800} fontSize={{xs:16, sm:22}} mt={1} sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>
                {allCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* ACTIVE */}
        <Grid item xs={4} md={3}>
          <Card sx={{ ...statCardStyle, minHeight: {xs:80, sm:110} , width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box"}}>
            <Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <ShowChartIcon color="success"  sx={{ fontSize: { xs: 18, sm: 24 } }}/>
                <Typography variant="body2" sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>{t("active") || "Active"}</Typography>
              </Box>
              <Typography fontWeight={800} fontSize={{xs:16, sm:22}} mt={1} sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>
                {activeCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* PAUSED */}
        <Grid item xs={4} md={3}>
          <Card sx={{ ...statCardStyle, minHeight: {xs:80, sm:110}, width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box" }}>
            <Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <PauseCircleIcon color="warning"  sx={{ fontSize: { xs: 18, sm: 24 } }} />
                <Typography variant="body2" sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>{t("paused") || "Paused"}</Typography>
              </Box>
              <Typography fontWeight={800} fontSize={{xs:16, sm:22}} mt={1} sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>
                {pausedCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Box sx={{ width: "100%", display: { xs: "block", md: "none" } }} />

        {/* COMPLETED */}
        <Grid item xs={6} md={3} 
  >
          <Card sx={{ ...statCardStyle, minHeight: {xs:80, sm:110}, width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box" }} spacing={{xs:0.5, sm:1}}>
            <Box>
              <Box display="flex" alignItems="center" gap={1.5}>
                <CheckCircleIcon color="success"  sx={{ fontSize: { xs: 18, sm: 24 } }} />
                <Typography variant="body2" sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>{t("completed") || "Completed"}</Typography>
              </Box>
              <Typography fontWeight={800} fontSize={{xs:16, sm:22}} mt={1} sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>
                {completedCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        

        {/* AVERAGE PROGRESS (larger and wider) */}
        <Grid item xs={6} md={3} 
  >
          <Card sx={{ ...statCardStyle, minHeight: {xs:80, sm:110}, width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box" }} spacing={{xs:0.5, sm:1}}>
            <Box
              sx={{ width: "100%" }}
            >

              <Box display="flex" alignItems="center" gap={1.5}>
                <BarChartIcon color="primary"  sx={{ fontSize: { xs: 18, sm: 24 } }}/>
                <Typography variant="body2" sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>{t("averageProgress") || "Average Progress"}</Typography>
              </Box>

              <Typography fontWeight={800} fontSize={{xs:12, sm:22}} mt={1} sx={{
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
}}>
                {avgProgress}%
              </Typography>

              {/* Progress Bar */}
              <Box
                sx={{
                  mt: 0.5,
                  height: 10,
                  height: {xs:4, sm:10},
                  borderRadius: 5,
                  backgroundColor: "#e5e7eb",
                  overflow: "hidden"
                }}
              >
                <Box
                  sx={{
                    width: `${avgProgress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #3b82f6, #60a5fa)"
                  }}
                />
              </Box>

            </Box>
          </Card>
        </Grid>

      </Grid>

      {/* FILTERS */}
      <Card sx={{ border: "1px solid #3b82f6", borderRadius: 6, mb: 2, p: { xs: 0.5, sm: 1 } }}>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>

          <Typography fontWeight={600} mb={1} sx={{ fontSize: { xs: "14px", sm: "16px" } }}>
            {/* Filter & Sorting */}
            {t("filter&Sorting") || "Filter & Sorting"}
          </Typography>

          <Tabs
            value={status}
            onChange={(_, v) => setStatus(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
    minHeight: { xs: 36, sm: 48 }
  }}
          >
            {STATUS_FILTERS(t).map(f => (
              <Tab
                key={f.value}
                label={f.label}
                value={f.value}
                sx={{
    whiteSpace: "nowrap",
    fontSize: { xs: "11px", sm: "14px" },
    minHeight: { xs: 36, sm: 48 },
    px: { xs: 1, sm: 2 }
  }}
              />
            ))}
          </Tabs>

          <Stack direction={{ xs: "column", md: "row" }} gap={{ xs: 2, sm: 1 }}
mt={{ xs: 2, sm: 2 }} flexWrap="nowrap" sx={{
            direction: isFa ? "rtl" : "ltr",
            "& > *": {
              marginLeft: isFa ? "0 !important" : undefined,
              marginRight: isFa ? "8px" : undefined
            }
          }}>

            <TextField
              sx={{ width: { xs: "100%", md: "620px" } }}
              size="small"
              label={t("searchByTitle") || "Search by title"}
              value={search}
              placeholder={t("searchGoalByTitle") || "search goal by title..."}
              onChange={(e) => setSearch(e.target.value)}


              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: { xs: 18, sm: 22 } }}/>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              sx={{ width: { xs: "100%", md: "320px" } }}
              select
              size="small"
              label={t("sortBy") || "Sort by"}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS(t).map(opt => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

          </Stack>

        </CardContent>
      </Card>

      {/* GOALS */}

      <Card
        sx={{
          border: "1px solid #3b82f6",
          borderRadius: 6,
          minHeight: 300,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {filteredGoals.length > 0 && (
            <Typography fontWeight={700} mb={2}>
              {/* Goals */}
              {t("goals") || "Goals"}
            </Typography>
          )}

          <Grid
            container
            spacing={2}
            alignItems="stretch"
            sx={{
              flex: 1,

              alignItems: filteredGoals.length === 0 ? "center" : "flex-start",
              justifyContent: filteredGoals.length === 0 ? "center" : "flex-start"
            }}
          >
            {filteredGoals.length === 0 ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Typography textAlign="center" color="text.secondary">

                    {t("noGoalFound") || "No goal found"}
                  </Typography>
                </Box>
              </Grid>
            ) : (
              filteredGoals.map(goal => (
                <Grid item
                  xs={12} sm={6} md={4}
                  sx={{ display: "flex" }}
                  key={goal.id} >


                  <GoalCard
                    goal={goal}
                    onDelete={handleDelete}
                    onPause={handlePause}
                    onMark={handleMark}
                    onEdit={handleEdit}
                  />

                </Grid>
              ))
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
