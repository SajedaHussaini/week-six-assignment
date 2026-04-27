import React, { useContext, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Stack,
  InputAdornment
} from "@mui/material";

import { GoalContext } from "../context/GoalContext";
import { LocaleContext } from "../context/LocaleContext";
import GoalCard from "../components/goals/GoalCard";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

export default function Archive() {
  const { goals, setGoals } = useContext(GoalContext);
  const { t } = useContext(LocaleContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const archivedGoals = goals.filter(
    g => g.status === "completed" || g.status === "deleted"
  );

  const handleRestore = (goal) => {
    const updated = goals.map(g =>
      g.id === goal.id
        ? { ...g, status: "active", updatedAt: new Date().toISOString() }
        : g
    );
    setGoals(updated);
    navigate("/goals");
  };

  const handlePermanentDelete = (goal) => {
    const updated = goals.filter(g => g.id !== goal.id);
    setGoals(updated);
  };

  const filtered = useMemo(() => {
    let data = [...archivedGoals];

    if (tab === "completed") {
      data = data.filter(g => g.status === "completed");
    }

    if (tab === "deleted") {
      data = data.filter(g => g.status === "deleted");
    }

    if (search.trim()) {
      data = data.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "newest") {
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    if (sort === "oldest") {
      data.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    }

    if (sort === "title") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }

    return data;
  }, [archivedGoals, tab, search, sort]);

  const completedGoals = filtered.filter(g => g.status === "completed");
  const deletedGoals = filtered.filter(g => g.status === "deleted");

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden"
      }}
    >

      {/* HEADER */}
      <Card sx={{
        border: "1px solid #3b82f6", borderRadius: 6, mb: 2,
        mx: { xs: 0.5 },
        px: { xs: 0.5 }
      }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700} mt={1} mb={1} fontSize={{ xs: 20, sm: 24, md: 32 }}>
            {t("archiveGoals") || "Archive Goals"}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            {t("manageYourCompletedAndDeletedGoalsHere") || "Manage your completed and deleted goals here."}
          </Typography>
        </CardContent>
      </Card>

      {/* FILTER */}
      <Card sx={{
        border: "1px solid #3b82f6", borderRadius: 6, mb: 2,
        mx: { xs: 0.5 },
        px: { xs: 0.5 }
      }}>
        <CardContent>
          <Typography fontWeight={600} mb={1}>
            {t("filter&Sorting") || "Filter & Sorting"}
          </Typography>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile>
            <Tab label={t("all") || "All"} value="all" />
            <Tab label={t("completed") || "Completed"} value="completed" />
            <Tab label={t("deleted") || "Deleted"} value="deleted" />
          </Tabs>

          <Stack direction={{ xs: "column", md: "row" }} gap={1} mt={2}>
            <TextField
              fullWidth
              label={t("searchArchivedGoal") || "Search archived goal"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search") || "search..."}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              select
              label={t("sortBy") || "Sort By"}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              sx={{ minWidth: { xs: "100%", md: 200 } }}
            >
              <MenuItem value="newest">{t("newestArchived") || "Newest Archived"}</MenuItem>
              <MenuItem value="oldest">{t("oldestArchived") || "Oldest Archived"}</MenuItem>
              <MenuItem value="title">{t("title") || "Title"}</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card sx={{
          border: "1px solid #3b82f6", borderRadius: 6, minHeight: { xs: 150, sm: 200 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <CardContent>
            <Typography textAlign="center" color="text.secondary" fontSize={{ xs: 14, sm: 16, md: 18 }}
              fontWeight={500}>

              {t("noGoalFound") || "No goal found"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* COMPLETED CARD */}
          <Card sx={{
            border: "1px solid #3b82f6", borderRadius: 6, mb: 2,
            mx: { xs: 0.5 },
            px: { xs: 0.5 }
          }}>
            <CardContent>
              <Typography fontWeight={700} mb={2}>
                {t("completedGoals") || "Completed Goals"}

              </Typography>

              <Grid container
                spacing={{ xs: 1.5, sm: 2, md: 3 }}
              >
                {completedGoals.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography textAlign="center" color="text.secondary">

                      {t("thereIsNoCompletedGoals") || "There is no completed goals."}
                    </Typography>
                  </Grid>
                ) : (
                  completedGoals.map(goal => (
                    <Grid item xs={12} sm={6} md={4} key={goal.id}>
                      <GoalCard
                        goal={goal}
                        archiveMode
                        onRestore={handleRestore}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>

          {/*DELETED CARD */}
          <Card sx={{
            border: "1px solid #3b82f6", borderRadius: 6,
            mx: { xs: 0.5 },
            px: { xs: 0.5 }
          }}>
            <CardContent>
              <Typography fontWeight={700} mb={2}>
                {t("deletedGoals") || "Deleted Goals"}
              </Typography>

              <Grid container
                spacing={{ xs: 1, sm: 2, md: 3 }}
              >
                {deletedGoals.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography textAlign="center" color="text.secondary">
                      {t("thereIsNoDeletedGoal") || "There is no deleted goal"}
                    </Typography>
                  </Grid>
                ) : (
                  deletedGoals.map(goal => (
                    <Grid item xs={12} sm={6} md={4} key={goal.id}>
                      <GoalCard
                        goal={goal}
                        archiveMode
                        onRestore={handleRestore}
                        onPermanentDelete={handlePermanentDelete}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
