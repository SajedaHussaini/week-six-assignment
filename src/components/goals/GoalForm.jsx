import React, { useContext } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  useTheme
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocaleContext } from "../../context/LocaleContext";
import AddIcon from "@mui/icons-material/Add";

const CATEGORIES = [
  { label: "Health", value: "health" },
  { label: "Study", value: "study" },
  { label: "Work", value: "work" },
  { label: "Personal", value: "personal" },
  { label: "Financial", value: "financial" },
  { label: "Hobby", value: "hobby" }
];

const TYPES = [
  { label: "Daily", value: "daily" },
  { label: "Count-based", value: "count" },
  { label: "Time-based", value: "time" }
];

export default function GoalForm({
  onSubmit,
  onCancel,
  form,
  isEdit = false
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = form;

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useContext(LocaleContext);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card
        sx={{
          borderRadius: { xs: 4, sm: 11 },
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.6)"
            : "0 10px 30px rgba(0,0,0,0.08)",
          p: { xs: 0.5, sm: 1 },
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          height: "100%",
          bgcolor: isDark ? "#0f172a" : "#fff",
          color: isDark ? "#e2e8f0" : "#000"
        }}
      >
        <CardContent
          sx={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* BLUE CARD */}
          <Card
            sx={{
              background: isDark
                ? "linear-gradient(135deg, #1e293b, #0f172a)"
                : "linear-gradient(135deg, #f4f7fa, #f1f7fc)",
              borderRadius: { xs: 4, sm: 11 },
              p: { xs: 1, sm: 2 },
              width: "100%",
              boxSizing: "border-box",
              mb: 0
            }}
          >

            <Typography variant="body2" color="black" mb={{ xs: 2, sm: 3 }} mt={{ xs: 1, sm: 2 }} fontSize={{ xs: 13, sm: 15 }} sx={{ color: isDark ? "#bab7b7" : "#0b0b0b" }}>
              {t("fillOutTheFormToDefineYourObjective") || "Fill out the form to define your objective."}
            </Typography>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                width: "100%",
                boxSizing: "border-box"
              }}
            >
              {/* INPUTS CARD */}
              <Card
                sx={{
                  p: { xs: 1, sm: 2 },
                  mb: 2,
                  borderRadius: { xs: 4, sm: 7 },
                   background: isDark ? "#111827" : "linear-gradient(135deg, #fafcfd, #f0f7fc)",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >

                <TextField
                  size="small"
                  label={t("title") || "Title"}
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  size="small"
                  select
                  label={t("category") || "Category"}
                  value={watch("category")}
                  onChange={(e) => setValue("category", e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  {CATEGORIES.map(c => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  select
                  label={t("goalType") || "Goal Type"}
                  {...register("type")}
                  fullWidth
                  margin="normal"
                >
                  {TYPES.map(t => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField

                  size="small"
                  label={t("target") || "Target"}
                  type="number"
                  {...register("target")}
                  error={!!errors.target}
                  helperText={errors.target?.message}
                  fullWidth
                  margin="normal"
                />

                <Box display="flex" gap={{ xs: 1, sm: 2 }} mt={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" }, direction: "ltr", "& > *": {
                      flex: 1,
                      minWidth: 0
                    }
                  }}>
                  <DatePicker
                    label={t("startDate") || "Start Date"}
                    value={watch("startDate") || null}
                    onChange={(val) => setValue("startDate", val)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { minWidth: 0 },
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message
                      }
                    }}
                  />

                  <DatePicker
                    label={t("endDate") || "End Date"}
                    value={watch("endDate") || null}
                    onChange={(val) => setValue("endDate", val)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { minWidth: 0 },
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message
                      }
                    }}
                  />
                </Box>
              </Card>

              {/* NOTES */}
              <Card
                sx={{
                  p: { xs: 1, sm: 2 },
                  mb: 2,
                  borderRadius: { xs: 4, sm: 7 },
                  width: "100%",
                  boxSizing: "border-box",

                }}
              >
                <Typography fontWeight={600} mb={1} fontSize={{ xs: 13, sm: 15 }} >
                  {t("notes") || "Notes"}
                </Typography>

                <TextField
                  size="small"
                  placeholder={t("writeSomethingAboutYourGoal") || "Write something about your goal..."}
                  {...register("notes")}
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiInputBase-input::placeholder": {
                      fontSize: { xs: "12px", sm: "15px" }
                    }
                  }}
                />
              </Card>

              {/* BUTTONS */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={3} mb={2} >

                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  type="submit"
                  sx={{
                    borderRadius: 6,
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { sm: 140 },
                    fontSize: { xs: 12, sm: 14 },
                    px: { xs: 1, sm: 2.5 },
                    py: { xs: 0.5, sm: 1 },
                    "& .MuiButton-startIcon": {
                      marginInlineStart: "0px",
                      marginInlineEnd: "8px"
                    },
                  }}
                >
                  {isEdit ? (t("saveChanges") || "Save Changes") : (t("createGoal") || "Create Goal")}
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={onCancel}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    minWidth: { sm: 140 },
                    borderRadius: 6,
                    fontSize: { xs: 12, sm: 14 },
                    px: { xs: 1, sm: 2.5 },
                    py: { xs: 0.5, sm: 1 },
                  }}
                >
                  {t("cancel") || "Cancel"}
                </Button>
              </Stack>

            </form>
          </Card>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );

}
