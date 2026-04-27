import React, { useContext, useState } from "react";
import { Box, Typography, Card } from "@mui/material";

import { GoalContext } from "../context/GoalContext";
import { LocaleContext } from "../context/LocaleContext";
import { useTheme } from "@mui/material/styles";
import CalendarWidget from "../components/calendar/CalendarWidget";

export default function CalendarPage() {
  const { goals } = useContext(GoalContext);
  const { t, locale } = useContext(LocaleContext);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const isRTL = locale === "fa";
  const [selectedDate, setSelectedDate] = useState(new Date());

  //Local date formatter 
  const formatLocalDate = (date) => {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };

  // marked dates 
  const markedDates = [];
  goals.forEach(goal => {
    goal.logs?.forEach(log => {
      if (log?.date) {
        const d = new Date(log.date);

        if (!isNaN(d)) {
          markedDates.push(formatLocalDate(d));
        }
      }
    });
  });

  //  today focus logic
  const todayGoals = goals.filter(g => {
    if (g.status === "completed") return false;

    const isDaily = g.type === "daily";

    let isUrgent = false;
    if (g.endDate) {
      const diff =
        (new Date(g.endDate) - new Date()) / (1000 * 60 * 60 * 24);

      isUrgent = diff <= 3;
    }

    const progress = (g.progress || 0) / (g.target || 1);
    const low = progress < 0.5;

    return isDaily || isUrgent || low;
  });

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        width: "100%",
        maxWidth: "100%",
        overflowX: "visible",
        boxSizing: "border-box"
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Box sx={{
        width: "100%", maxWidth: { xs: "100%", md: 900 }, mx: "auto"
      }}>

        {/* TITLE */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} fontSize={{ xs: 30, md: 32 }} mb={{ xs: 1, sm: 1 }}>
            {t("calendar") || "Calendar"}
          </Typography>

          <Typography color="text.secondary" fontSize={{ xs: 14, sm: 16 }} >
            {t("trackYourActivityAndStayConsistentEveryDay") ||
              "Track your activity and stay consistent every day"}
          </Typography>
        </Box>

        {/* MAIN CARD */}
        <Card
          sx={{
            border: "1px solid #3b82f6",
            p: { xs: 1.5, sm: 3 },
            borderRadius: 4,
            background: isDark ? "#0f172a" : "#f5f7fb"
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, md: 3 },
              flexWrap: "wrap",
              width: "100%",
              overflow: "hidden",
              alignItems: "stretch",
              flexDirection: { xs: "column", md: "row" }
            }}
          >

            {/* CALENDAR */}
            <Card
              sx={{

                flex: 1,
                width: "100%",
                minWidth: 0,
                maxWidth: { xs: "100%", md: 420 },
                p: { xs: 1.5, sm: 3 },
                borderRadius: 4,
                color: isDark ? "white" : "black",
                background: isDark
                  ? "#41516e"
                  : "linear-gradient(135deg, #f8fafc, #eef6ff)"
              }}
            >
              <CalendarWidget
                selectedDate={selectedDate}
                onChange={setSelectedDate}
                markedDates={markedDates}

              />
            </Card>

            {/* TODAY FOCUS */}
            <Card
              sx={{
                flex: 1,
                width: "100%",
                minWidth: { xs: "100%", md: 250 },
                maxWidth: { xs: "100%", md: 300 },
                p: { xs: 1.5, sm: 2 },
                borderRadius: 4,
                background: isDark ? "#334155" : "#98c4ef",
                color: isDark ? "white" : "black",
                display: "flex",
                flexDirection: "column",
                direction: isRTL ? "rtl" : "ltr"
              }}
            >
              <Typography fontWeight={700} fontSize={{ xs: 14, sm: 16 }}>
                {t("todayFocus") || "Today Focus"}
              </Typography>

              <Box
                sx={{
                  overflowY: "auto",
                  maxHeight: { xs: 180, sm: 250, md: 300 }
                }}
              >
                {todayGoals.length === 0 ? (
                  <Typography variant="body2" fontSize={{ xs: 14, sm: 16 }}>
                    {t("noGoalsForToday") || "No goals for today"}
                  </Typography>
                ) : (
                  todayGoals.map((g, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      mb={1}
                      sx={{
                        fontSize: { xs: 12, sm: 14 },
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >

                      • {g.title} ({g.progress}/{g.target})
                    </Typography>
                  ))
                )}
              </Box>
            </Card>
          </Box>
        </Card>
      </Box>
    </Box>
  );

}
