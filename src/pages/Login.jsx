import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Card,
  useTheme,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/loginValidation";
import { AuthContext } from "../context/AuthContext";
import { LocaleContext } from "../context/LocaleContext";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import ThemeToggle from "../components/common/ThemeToggle";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { t, locale } = useContext(LocaleContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const isRtl = locale === "fa";
  const helperTextProps = {
    sx: {
      direction: isRtl ? "rtl" : "ltr",
      textAlign: isRtl ? "right" : "left"
    }
  };

  const schema = React.useMemo(() => loginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange"
  });

  React.useEffect(() => {
    reset(undefined, { keepValues: true });
  }, [schema, reset]);


  const [loading, setLoading] = useState(false)

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          background: theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #060d19, #1e2f42)"
            : "linear-gradient(135deg, #e3f2fd, #bbd3dd)"
        }}
      >
        <CircularProgress />

        <Typography variant="h6">
          {t("loadingDashboard") || "Loading Dashboard..."}
        </Typography>
      </Box>
    );
  }

  const onSubmit = (data) => {
    const user = login(data.email, data.password);

    if (user) {
      setLoading(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 1.5,
        background: theme.palette.mode === "dark"
          ? "linear-gradient(135deg, #060d19, #1e2f42)"
          : "linear-gradient(135deg, #e3f2fd, #bbd3dd)"
      }}
    >

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          maxWidth: { xs: 360, sm: 400, md: 420 },
          mx: "auto",
          borderRadius: { xs: 3, sm: 4 },
          background: theme.palette.mode === "dark"
            ? "#102541"
            : "#fff"
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
          sx={{
            gap: 1,
            flexWrap: "wrap"
          }}
        >
          <Box sx={{
            border: "1.5px solid #1976d2",
            borderRadius: 6,
            px: { xs: 1.5, sm: 2 },
            py: 0.5
          }}>
            <LanguageSwitcher />
          </Box>

          <Box sx={{
            border: "1.5px solid #1976d2",
            borderRadius: 6,
            px: { xs: 1.5, sm: 2 },
            py: 0.5
          }}>
            <ThemeToggle />
          </Box>
        </Box>



        <Typography variant="h5" fontWeight={600} mb={2} textAlign="center" fontSize={{ xs: 20, sm: 24 }}>
          {t("login") || "Login"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <TextField
            size="medium"
            label={t("fullName") || "fullName"}
            fullWidth
            margin="normal"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            FormHelperTextProps={helperTextProps}
          />

          {/* Email */}
          <TextField
            size="medium"
            label={t("email") || "Email"}
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            FormHelperTextProps={helperTextProps}
          />

          {/* Password */}
          <TextField
            size="medium"
            label={t("password") || "Password"}
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            FormHelperTextProps={helperTextProps}
            InputProps={{
              sx: {
                direction: "ltr"
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(p => !p)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />


          {/* Remember Me */}
          <FormControlLabel
            sx={{

              "& .MuiTypography-root": {
                fontSize: { xs: 13, sm: 14 }
              }
            }}
            control={<Checkbox {...register("remember")} />}
            label={t("rememberme")}
          />

          {/* Login Button */}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2, py: 1.2, py: { xs: 0.8, sm: 1.2 }, borderRadius: 6, fontSize: { xs: 13, sm: 14 } }}
          >
            {t("loginToDashboard") || ("loginToDashboard")}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
