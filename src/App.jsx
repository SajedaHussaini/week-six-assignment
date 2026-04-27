import React from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "./theme/theme";
import { ThemeContext } from "./context/ThemeContext";
import { LocaleContext } from "./context/LocaleContext";
import AppRoutes from "./routes/AppRoutes";
import SplashScreen from "./pages/SplashScreen";
import { NotificationProvider } from "./context/NotificationContext";
import AppSnackbar from "./components/common/AppSnackbar";


export default function App() {
  const { mode } = React.useContext(ThemeContext);
  const { locale } = React.useContext(LocaleContext);
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  const dir = locale === "fa" ? "rtl" : "ltr";
  const theme = getTheme(mode, dir);

  // List of known routes in my app
  const knownPaths = [
    "/",
    "/dashboard",
    "/goals",
    "/goals/new",
    "/archive",
    "/calendar",
    "/categories",
    "/settings",
    "/login",
  ];

  const isGoalsDetail = /^\/goals\/[^/]+$/.test(location.pathname);
  const isKnown =
    knownPaths.includes(location.pathname) || isGoalsDetail;

  React.useEffect(() => {
    document.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);


  React.useEffect(() => {
    if (!isKnown) return; 
    const timer = setTimeout(() => 
      setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [isKnown]); 

  if (loading && isKnown) {
    return <SplashScreen />;
  }

  return (
    <NotificationProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppSnackbar />
      <AppRoutes />
      
    </ThemeProvider>
    </NotificationProvider>
  );
}
