import React from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

export default function ProgressBar({ value, max, label }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <Box>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 7, borderRadius: 3 }} />
      <Typography variant="caption" display="block">{label} ({value}/{max})</Typography>
    </Box>
  );
}
