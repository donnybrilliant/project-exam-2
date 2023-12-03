import { useTheme } from "@mui/material/styles";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";

// Calendar component with disabled dates and date range selection
const Calendar = ({
  selectedVenue,
  dateRange,
  setDateRange,
  currentBooking,
}) => {
  // Check if the selected venue has any bookings that overlap with the selected date range
  const checkDisabledDatesInRange = (startDate, endDate) => {
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");
    return selectedVenue?.bookings.some((booking) => {
      if (booking.id === currentBooking?.id) {
        return false;
      }
      const bookingStart = dayjs(booking.dateFrom).startOf("day");
      const bookingEnd = dayjs(booking.dateTo);
      return start.isBefore(bookingEnd) && end.isAfter(bookingStart);
    });
  };

  // Handle date clicks in the calendar
  const handleDateClick = (date) => {
    setDateRange((prevRange) => {
      let [start, end] = prevRange;

      // No dates are selected, set the clicked date as the start date
      if (!start && !end) {
        return [date, null];
      }

      // Only end date is selected and the clicked date is before it, set the clicked date as the start date
      if (!start && end && dayjs(date).isBefore(end, "day")) {
        return [date, end];
      }

      // If a date is clicked twice, set the start to the clicked date and the end to null
      if (dayjs(date).isSame(start, "day") || dayjs(date).isSame(end, "day")) {
        return [date, null];
      }

      // Set the clicked date as the new start date if it is before the current start date
      if (start && dayjs(date).isBefore(start, "day")) {
        return [date, null];
      }

      // Set the clicked date as the new end date if it is after the current start date
      // and does not include any disabled dates in the new range
      if (
        start &&
        dayjs(date).isAfter(start, "day") &&
        !checkDisabledDatesInRange(start, date)
      ) {
        return [start, date];
      }

      // If the clicked date is within the current range, maintain the current range
      if (start && end && dayjs(date).isBetween(start, end, "day")) {
        return prevRange;
      }

      // Clicking outside the current range resets the range
      return [date, null];
    });
  };

  // Custom day component to highlight days in the calendar
  const CustomDay = (props) => {
    const theme = useTheme();
    const { day } = props;
    const isStart = dateRange[0] && dayjs(day).isSame(dateRange[0], "day");
    const isEnd = dateRange[1] && dayjs(day).isSame(dateRange[1], "day");
    const inRange =
      isStart ||
      isEnd ||
      (dateRange[0] &&
        dateRange[1] &&
        dayjs(day).isAfter(dateRange[0], "day") &&
        dayjs(day).isBefore(dateRange[1], "day"));

    const matchedStyles = inRange
      ? {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
          "&:focus": {
            backgroundColor: theme.palette.primary.dark,
          },
        }
      : {};

    return <PickersDay {...props} sx={{ ...matchedStyles }} />;
  };

  return (
    <DateCalendar
      onChange={handleDateClick}
      slots={{ day: CustomDay }}
      disablePast
      value={dateRange[0]}
      shouldDisableDate={(day) => {
        const utcDay = dayjs(day).utc();
        return checkDisabledDatesInRange(utcDay, utcDay);
      }}
    />
  );
};

export default Calendar;
