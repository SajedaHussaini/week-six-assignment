import React, { useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Grid
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { GoalContext } from "../context/GoalContext";
import GoalCard from "../components/goals/GoalCard";
import { LocaleContext } from "../context/LocaleContext";

export default function SearchPage() {
  const { goals } = useContext(GoalContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useContext(LocaleContext);

  const query = new URLSearchParams(location.search);
  const q = (query.get("q") || "").toLowerCase();

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return goals.filter(g =>
      (g.title || "").toLowerCase().includes(q) ||
      (g.notes || "").toLowerCase().includes(q) ||
      (g.category || "").toLowerCase().includes(q)
    );
  }, [goals, q]);

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontWeight={600}
        mb={4}
        sx={{ fontSize: { xs: 14, sm: 19 } }}
      >
        {t("searchResultsFor") || "Search results for"} "{q}"
      </Typography>

      {!q ? (
        <Typography textAlign="center" color="text.secondary">
          {t("startTypingToSearch") || "Start typing to search"}
        </Typography>
      ) : results.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          {t("noResultsFound") || "No results found"}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {results.map(goal => (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <GoalCard
                goal={goal}
                onEdit={() => navigate(`/goals/${goal.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
