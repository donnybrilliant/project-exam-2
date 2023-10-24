import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
dayjs.extend(utc);

const Calendar = ({ selectedVenue, dateRange, setDateRange }) => {
  const checkDisabledDatesInRange = (startDate, endDate) => {
    for (let d = startDate; d <= endDate; d = dayjs(d).add(1, "day")) {
      if (
        selectedVenue?.bookings.some(
          (booking) =>
            d.isAfter(
              dayjs.utc(booking.dateFrom).subtract(1, "day").startOf("day")
            ) && d.isBefore(dayjs.utc(booking.dateTo).startOf("day"))
        )
      ) {
        return true;
      }
    }
    return false;
  };
  const handleDateClick = (date) => {
    setDateRange((prevRange) => {
      const startDate = prevRange[0];
      const endDate = date;

      // Set start date if no start date is selected
      if (!startDate) {
        return [date, null];
      } else if (
        // Reset start date if end date is clicked twice
        prevRange[1] &&
        dayjs(prevRange[1]).isSame(dayjs(date), "day")
      ) {
        return [date, null];
      }
      // Set new start date if selected date is before the current start date
      if (dayjs(date).isBefore(dayjs(startDate), "day")) {
        return [date, null];
      }
      // If the selected date is in the disabled range, set it as the new start date
      if (checkDisabledDatesInRange(startDate, date)) {
        return [date, null];
      }

      // Reset start date if new start date and end date are the same
      if (dayjs(startDate).isSame(dayjs(endDate), "day")) {
        return [startDate, null];
      }
      // Extend range if two dates already selected
      if (prevRange[1]) {
        return [startDate, endDate];
      }

      return [startDate, endDate];
    });
  };

  // Custom day component to highlight days in calendar
  const CustomDay = (props) => {
    const theme = useTheme();
    const inRange =
      dateRange[0] &&
      dateRange[1] &&
      dayjs(props.day).isBetween(dateRange[0], dateRange[1], "day", "[]");

    const matchedStyles = inRange
      ? {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        }
      : {};
    return <PickersDay {...props} sx={{ ...matchedStyles }} />;
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        onChange={handleDateClick}
        slots={{ day: CustomDay }}
        disablePast
        value={dateRange[0]}
        shouldDisableDate={(day) => {
          return selectedVenue?.bookings.some(
            (booking) =>
              day.isAfter(
                dayjs.utc(booking.dateFrom).subtract(1, "day").startOf("day")
              ) && day.isBefore(dayjs.utc(booking.dateTo).startOf("day"))
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;
