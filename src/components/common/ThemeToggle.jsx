import React, { useContext } from "react";
import { Switch, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext } from "../../context/ThemeContext";
import { LocaleContext } from "../../context/LocaleContext";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { t } = useContext(LocaleContext);

  return (
    <Tooltip title={mode === "light" ? t("darkMode") : t("lightMode")}>
      <Switch
        checked={mode === "dark"}
        onChange={toggleTheme}
        icon={<LightModeIcon fontSize="small" />}
        checkedIcon={<DarkModeIcon fontSize="small" />}
        inputProps={{ "aria-label": "theme toggle" }}
      />
    </Tooltip>
  );
}
