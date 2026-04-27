import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent
} from "@mui/material";
import goal from "../assets/goal.jpg";
import { LocaleContext } from "../context/LocaleContext";

export default function SplashScreen() {
  const { t } = useContext(LocaleContext);

  const [fadeOut, setFadeOut] = useState(false);
  const [typedText, setTypedText] = useState("");

  const fullText =
    t("trackYourGoalsAndStayConsistent") ||
    "Track your goals and stay consistent";

  //fade out (slightly longer for better UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // typing animation 
  useEffect(() => {
    let i = 0;

    setTypedText(""); // reset before typing

    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        background: "linear-gradient(135deg, #c4ddf8, #e0e8f9)",

        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? "scale(0.98)" : "scale(1)",
        transition: "all 0.6s ease"
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: { xs: 500, sm: 650, md: 900, lg: 1100 },
          minHeight: { xs: "85vh", sm: "70vh", md: "60vh", lg: 500 },

          borderRadius: 14,
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.35)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          py: { xs: 2, sm: 3, md: 6 },
          px: { xs: 2, sm: 3, md: 5 },

          animation: "fadeIn 1.2s ease"
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          {/* LOGO */}
          <Box sx={{ mb: 2, animation: "logoZoom 1.5s ease" }}>
            <img
              src={goal}
              alt="Goal Tracker"
              style={{
                width: "clamp(90px, 18vw, 130px)",
                height: "auto",
                borderRadius: 16
              }}
            />
          </Box>

          {/* TITLE */}
          <Typography
            sx={{
              fontSize: {
                xs: "1.6rem",
                sm: "2.2rem",
                md: "3rem"
              },
              fontWeight: 700,
              color: "#0e0d0d",
              animation: "textFade 1.2s ease"
            }}
          >
            {t("appName") || "Goal Tracker"}
          </Typography>

          {/* TYPING TEXT */}
          <Typography
            sx={{
              mt: 1,
              fontSize: {
                xs: "0.8rem",
                sm: "1.5rem",
                md: "1.2rem"
              },
              color: "rgba(21, 20, 20, 0.85)",
              animation: "textFade 1.4s ease"
            }}
          >
            {typedText}
          </Typography>

          {/* LOADING */}
          <Box mt={4} sx={{ animation: "textFade 1.6s ease" }}>
            <CircularProgress sx={{ color: "#73a4f4" }} size={35} />

            <Typography
              sx={{
                mt: 2,
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.9rem",
                  md: "1rem"
                },
                color: "#131212"
              }}
            >
              {t("loadingGoalTrackerPleaseWait") ||
                "Loading Goal Tracker, please wait..."}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes logoZoom {
            0% { transform: scale(0.7); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes textFade {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}

