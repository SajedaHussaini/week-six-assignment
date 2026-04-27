import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useNotification } from "../../context/NotificationContext";

export default function AppSnackbar() {
  const { snackbar, closeNotification } = useNotification();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={closeNotification}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={closeNotification}
        severity={snackbar.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}
