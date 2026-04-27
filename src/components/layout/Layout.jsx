import React, { useState, useContext } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { LocaleContext } from "../../context/LocaleContext";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  const { locale } = useContext(LocaleContext);
  const drawerWidth = 190;
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>

      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: !isMobile && dir === "ltr" ? `${drawerWidth}px` : 0,
          mr: !isMobile && dir === "rtl" ? `${drawerWidth}px` : 0,
          width: "100%",
          maxWidth: "100%"
        }}
      >
        <Topbar onMenuClick={() => setOpen(true)} />

        <Box
          component="main"
          sx={{
            flex: 1,
            mt: { xs: "56px", sm: "64px" },
            p: 2,
            px: { xs: 0, sm: 2 },
            overflowY: "auto"
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
