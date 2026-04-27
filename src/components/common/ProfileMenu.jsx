import React, { useContext, useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { AuthContext } from "../../context/AuthContext";
import { LocaleContext } from "../../context/LocaleContext";

export default function ProfileMenu() {
  const { user, logout } = useContext(AuthContext);
  const { t } = useContext(LocaleContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = (event) => setAnchorEl(event.currentTarget);
  const close = () => setAnchorEl(null);

  if (!user) return null;

  return (
    <>
      <IconButton size="small" onClick={open} sx={{ ml: { xs: 0.5, sm: 1 } }}>
        <Avatar src={user.avatar} sx={{
          width: { xs: 28, sm: 33, md: 37 },
          height: { xs: 28, sm: 33, md: 37 },
          fontSize: { xs: 12, sm: 15 }
        }}>{user.name?.[0] || "U"}</Avatar>
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={close}>
        <MenuItem disabled>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          <Typography variant="body2">{user.name}</Typography>
        </MenuItem>
        <MenuItem onClick={() => { logout(); close(); }}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          {t("logout")}
        </MenuItem>
      </Menu>
    </>
  );
}
