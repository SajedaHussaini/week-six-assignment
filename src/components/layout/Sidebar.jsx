import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  useMediaQuery
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArchiveIcon from "@mui/icons-material/Archive";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";

import { NavLink, useLocation } from "react-router-dom";
import { LocaleContext } from "../../context/LocaleContext";

const NAV_LINKS = [
  { to: "/", label: "dashboard", icon: <DashboardIcon /> },
  { to: "/goals", label: "goals", icon: <ListAltIcon /> },
  { to: "/categories", label: "categories", icon: <CategoryIcon /> },
  { to: "/archive", label: "archive", icon: <ArchiveIcon /> },
  { to: "/calendar", label: "calendar", icon: <CalendarMonthIcon /> },
  { to: "/settings", label: "settings", icon: <SettingsIcon /> }
];

export default function Sidebar({ open, onClose }) {
  const { t, locale } = useContext(LocaleContext);
  const location = useLocation();

  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={onClose}
      anchor={locale === "fa" ? "right" : "left"}
      sx={{
        "& .MuiDrawer-paper": {
          width: 190,
          top: isMobile ? 0 : 64
        }
      }}
    >
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 2,
            borderBottom: "1px solid #eee"
          }}
        >
          <IconButton onClick={onClose}>
            <MenuIcon />
          </IconButton>

          <Typography fontWeight={600}>
            {t("appName") || "Goal Tracker"}
          </Typography>
        </Box>
      )}

      <List>
        {NAV_LINKS.map((link) => {
          const isActive = (path) => {
            if (path === "/goals") {
              return location.pathname.startsWith("/goals");
            }
            return location.pathname === path;
          };
          const active = isActive(link.to);

          return (
            <ListItemButton
              key={link.to}
              component={NavLink}
              to={link.to}
              onClick={onClose}
              sx={{
                color: active ? "#1976d2" : "inherit",
                backgroundColor: active
                  ? "rgba(25,118,210,0.12)"
                  : "transparent",
                borderRadius: 2,
                mx: 1,
                my: 0.5
              }}
            >
              <ListItemIcon
                sx={{ color: active ? "#1976d2" : "#777" }}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText primary={t(link.label)} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
