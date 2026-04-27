import React from "react";
import { Box, Tooltip } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function CalendarWidget({
  selectedDate,
  onChange,
  markedDates = []
}) {
  const ltrTheme = React.useMemo(() => createTheme({ direction: "ltr" }), []);

  return (
    <ThemeProvider theme={ltrTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{width: "100%", maxWidth: "100%", mx: "auto" }} dir="ltr">
          <DateCalendar
            value={selectedDate}
            onChange={onChange}
            // sx={{ direction: "ltr" }}
            sx={{
              direction: "ltr",
      width: "100%",   // 🔥 مهم
      maxWidth: "100%",
      "& .MuiPickersCalendarHeader-root": {
        px: { xs: 0.5, sm: 2 },
        fontSize:{xs:12, sm:14}
      },
      "& .MuiDayCalendar-root": {
  margin: 0
},
      "& .MuiDayCalendar-weekContainer": {
        justifyContent: "center"
      },
      "& .MuiPickersDay-root": {
        fontSize: { xs: 11, sm: 14 },
        height: { xs: 32, sm: 36 },
        width: { xs: 32, sm: 36 },
        
        
      }
    }}
            renderDay={(day, _value, DayComponentProps) => {
              const dateStr = day.toLocaleDateString("en-CA");
              const isMarked = markedDates.includes(dateStr);

              return (
                <Tooltip
                  title={isMarked ? "Has activity" : ""}
                  arrow
                >
                  <PickersDay
                    {...DayComponentProps}
                    sx={{
                      ...(isMarked && {
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#1565c0"
                        }
                      })
                    }}
                  />
                </Tooltip>
              );
            }}
          />
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
