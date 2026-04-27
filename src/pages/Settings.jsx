import React, { useContext } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Stack,
  Card,
  CardContent
} from "@mui/material";

import LanguageSwitcher from "../components/common/LanguageSwitcher";
import ThemeToggle from "../components/common/ThemeToggle";
import { LocaleContext } from "../context/LocaleContext";
import { GoalContext } from "../context/GoalContext";

import DownloadIcon from "@mui/icons-material/Download";
import LanguageIcon from "@mui/icons-material/Language";
import PaletteIcon from "@mui/icons-material/Palette";

import {
  exportGoalsToJSON,
  exportGoalsToCSV
} from "../utils/export";

export default function Settings() {
  const { t } = useContext(LocaleContext);
  const { goals } = useContext(GoalContext);

  const handleExportJSON = () => exportGoalsToJSON(goals);
  const handleExportCSV = () => exportGoalsToCSV(goals);

  return (
    <Box p={3} maxWidth={700} mx="auto">

      {/* MAIN CARD */}
      <Card
        sx={{
          border: "1px solid #3b82f6",
          borderRadius: 6,
          boxShadow: 3
        }}
      >
        <CardContent>

          <Typography variant="h5" fontWeight={700} mb={2}>
            {t("settings") || "Settings"}
          </Typography>

          <Stack spacing={1.5} mb={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LanguageIcon sx={{ color: "#3b82f6" }} />
              <Typography fontWeight={600}>
                {t("language") || "Language"}
              </Typography>
            </Stack>

            <LanguageSwitcher />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* THEME */}
          <Stack spacing={1.5} mb={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PaletteIcon sx={{ color: "#10b981" }} />
              <Typography fontWeight={600}>
                {t("theme") || "Theme"}
              </Typography>
            </Stack>

            <ThemeToggle />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* EXPORT */}
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DownloadIcon sx={{ color: "#f59e0b" }} />
              <Typography fontWeight={600}>
                {t("exportGoals") || "Export Goals"}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="outlined"
                onClick={handleExportJSON}
                sx={{ borderRadius: 3 }}
              >
                {t("exportJson") || "Export JSON"}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleExportCSV}
                sx={{ borderRadius: 3 }}
              >
                {t("exportCsv") || "Export CSV"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
