import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const showNotification = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeNotification = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider
      value={{
        snackbar,
        showNotification,
        closeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
export const useNotification = () => useContext(NotificationContext);
