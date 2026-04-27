import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationsRead,
  removeNotification
} from "../../api/notifications";

import { LocaleContext } from "../../context/LocaleContext";
import { formatDate } from "../../utils/date";


export default function NotificationsMenu() {
  const { t } = useContext(LocaleContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const load = () => setNotifications(getNotifications());

  useEffect(() => {
    load();
    window.addEventListener("notification_update", load);

    return () =>
      window.removeEventListener("notification_update", load);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    load();
  };

  const handleClose = () => {
    setAnchorEl(null);
    markNotificationsRead();
    load();
  };

  const handleNavigate = (n) => {
  console.log("CLICKED NOTIF:", n);

  if (n.route) {
    navigate(n.route);
  } else if (n.goalId) {
    navigate(`/goals/${n.goalId}`);
  }

  setAnchorEl(null);
};

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge
          badgeContent={unreadCount}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#3b82f6",
              color: "white"
            }
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        PaperProps={{ style: { width: 320 } }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            {t("noNotifications") || "No notifications"}
          </MenuItem>
        ) : (
          notifications.slice(0, 5).map(n => (
            <MenuItem
              key={n.id}
              selected={!n.read}
              onClick={() => handleNavigate(n)}
            >
              <ListItemText
                primary={n.text}
                secondary={formatDate(n.date)}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(n.id);
                  load();
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
