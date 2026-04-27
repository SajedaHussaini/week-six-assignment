import { Light } from "@mui/icons-material";
import { purple } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const getTheme = (mode = "light", dir = "ltr") =>
  createTheme({
    direction: dir,
    palette: {
      mode,
      primary: {
        main: "#1976d2"
      },
      secondary: {
        main: "#ffa000"
      },
      purple: {
        main: "#9c27b0",
        light: "#ba68c8",
        dark: "#7b1fa2",
        contrastText: "#fff"
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#161c24",
        paper: mode === "light" ? "#fff" : "#222"
      }
    },
    typography: {
      fontFamily:
        dir === "rtl"
          ? "'Vazirmatn', 'Roboto', 'Arial', sans-serif"
          : "'Roboto', 'Arial', 'Vazirmatn', sans-serif"
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: dir
          }
        }
      }
    }
  });

export default getTheme;
