import React, { useContext } from "react";
import { LocaleContext } from "../../context/LocaleContext";
import { MenuItem, Select } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useContext(LocaleContext);

  return (
    <Select
      value={locale}
      onChange={e => changeLocale(e.target.value)}
      variant="standard"
      sx={{ minWidth: 56, paddingLeft: 1 }}
      icon={<LanguageIcon />}
      disableUnderline
    >
      <MenuItem value="en">EN</MenuItem>
      <MenuItem value="fa">FA</MenuItem>
    </Select>
  );
}
