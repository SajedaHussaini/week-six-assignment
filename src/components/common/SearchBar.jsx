import React, { useState, useContext, useEffect } from "react";
import { InputBase, Paper, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";
import { LocaleContext } from "../../context/LocaleContext";

export default function SearchBar({ onSearch, autoFocus = false }) {
  const { t } = useContext(LocaleContext);
  const location = useLocation();

  const [search, setSearch] = useState("");

  // sync with URL (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearch(q);
  }, [location.search]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(search, "submit"); 
  };

  const handleClear = () => {
    setSearch("");
    if (onSearch) onSearch("", "clear"); 
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: "2px 6px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        borderRadius: 6,
        boxShadow: 0
      }}
      elevation={0}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={t("search")}
        value={search}
        onChange={handleChange}
        autoFocus={autoFocus}
      />

      {search && (
        <IconButton size="small" onClick={handleClear}>
          ✕
        </IconButton>
      )}

      <IconButton size="small" type="submit" sx={{ p: 1 }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
