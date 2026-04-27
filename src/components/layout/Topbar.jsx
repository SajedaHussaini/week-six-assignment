import React, { useContext, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  Dialog,
  Slide
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import LanguageSwitcher from "../common/LanguageSwitcher";
import ThemeToggle from "../common/ThemeToggle";
import NotificationsMenu from "../common/NotificationsMenu";
import ProfileMenu from "../common/ProfileMenu";
import { LocaleContext } from "../../context/LocaleContext";
import goal from "../../assets/goal.jpg";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Topbar({ onMenuClick }) {
  const { t } = useContext(LocaleContext);
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const location = useLocation();

  const [openSearch, setOpenSearch] = useState(false);

  const prevPathRef = useRef(null);

  //saving the route just once before entering to search
  const openSearchModal = () => {
    if (!location.pathname.startsWith("/search")) {
      prevPathRef.current = location.pathname + location.search;
    }
    setOpenSearch(true);
  };

  const handleSearch = (text, type) => {
    const value = text.trim();

    if (type === "clear") {
      setOpenSearch(false);

      if (window.history.length > 1) {
        navigate(-1);
      } else if (prevPathRef.current) {
        navigate(prevPathRef.current);
      } else {
        navigate("/");
      }

      return;
    }

    //for emptying the input
    if (!value) {
      setOpenSearch(false);

      if (window.history.length > 1) {
        navigate(-1);
      } else if (prevPathRef.current) {
        navigate(prevPathRef.current);
      } else {
        navigate("/");
      }

      return;
    }
    //submit
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setOpenSearch(false);
  };

  return (
    <>
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            px: { xs: 1, sm: 2 },
            minHeight: { xs: 52, sm: 64 },
            backgroundColor: "rgba(25, 118, 210, 0.15)",
            borderBottom: "1px solid rgba(25,118,210,0.2)",
            gap: { xs: 0.5, sm: 1 },
            gridTemplateColumns: {
              xs: "auto auto auto",
              md: "auto 1fr auto"
            }

          }}
        >
          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1 } }}>
            {isMobile && (
              <IconButton size="small" onClick={onMenuClick}>
                <MenuIcon fontSize="small" />
              </IconButton>
            )}

            <Box
              component="img"
              src={goal}
              alt="Goal Tracker"
              sx={{
                width: { xs: 28, sm: 36 },
                height: { xs: 28, sm: 36 },
                borderRadius: "50%"
              }}
            />

            {!isMobile && (
              <Typography fontWeight={600} fontSize={20} noWrap>
                {t("appName")}
              </Typography>
            )}
          </Box>

          {/* CENTER */}
          {!isMobile ? (
            <Box sx={{ flex: 1, mx: 2, maxWidth: 500, mx: "auto" }}>
              <SearchBar onSearch={handleSearch} />
            </Box>
          ) : (
            <IconButton size="small" onClick={openSearchModal}>
              <SearchIcon fontSize="small" />
            </IconButton>
          )}

          {/* RIGHT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.1, sm: 1 } }}>
            <LanguageSwitcher />
            <ThemeToggle />
            <NotificationsMenu />
            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE SEARCH */}
      <Dialog
        fullScreen
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        TransitionComponent={Transition}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => setOpenSearch(false)}>
            <CloseIcon />
          </IconButton>

          <Box sx={{ flex: 1 }}>
            <SearchBar onSearch={handleSearch} autoFocus />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
