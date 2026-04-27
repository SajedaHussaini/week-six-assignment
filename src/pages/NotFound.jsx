import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocaleContext } from "../context/LocaleContext";

export default function NotFound() {
  const { t } = useContext(LocaleContext);
  const navigate = useNavigate();

  return (
    <Box p={4} textAlign="center" mt={8}>
      <Typography variant="h1" color="error" mb={2}>404</Typography>
      <Typography variant="h5" mb={3}>{t("pageNotFound") || "Page not found"}</Typography>
      <Button sx={{borderRadius:6}} variant="contained" color="primary" onClick={() => navigate("/")}>
        {t("backHome") || "Back Home"}
      </Button>
    </Box>
  );
}
