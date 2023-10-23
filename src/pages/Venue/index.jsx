import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVenueStore, useAuthStore, useFetchStore } from "../../stores";
import ImageGallery from "../../components/ImageGallery";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Button,
  Stack,
  Avatar,
  CardHeader,
  Box,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useTheme } from "@mui/material/styles";
dayjs.extend(utc);

// Venue page component
const VenuePage = () => {
  // Get id from URL
  let { id } = useParams();
  // Get states and actions from venuesStore
  const token = useAuthStore((state) => state.token);
  const selectedVenue = useVenueStore((state) => state.selectedVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const isLoading = useFetchStore((state) => state.isLoading);
  const isError = useFetchStore((state) => state.isError);
  const [dateRange, setDateRange] = useState([null, null]);

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

  //console.log(dateRange);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch venue when id changes
  useEffect(() => {
    fetchVenueById(id);
  }, [id]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error</h1>;

  //console.log(selectedVenue);

  const navigateToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          image={selectedVenue?.media[0]}
          alt={selectedVenue?.name}
          style={{ height: "450px" }}
        />
        <CardContent>
          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h5" component="div">
              {selectedVenue?.name}
            </Typography>
            <Rating
              name="venue-rating"
              value={selectedVenue?.rating ?? 0}
              precision={0.5}
              readOnly
              style={{ marginBottom: 2 }}
            />
          </Container>
          <Typography>Description:</Typography>
          <Typography variant="body2">{selectedVenue?.description}</Typography>

          <Typography>Max Guests: {selectedVenue?.maxGuests}</Typography>

          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Stack direction="row" spacing={2}>
              <WifiIcon
                color={selectedVenue?.meta.wifi ? "info" : "disabled"}
              />
              <LocalParkingIcon
                color={selectedVenue?.meta.parking ? "info" : "disabled"}
              />
              <FreeBreakfastIcon
                color={selectedVenue?.meta.breakfast ? "info" : "disabled"}
              />
              <PetsIcon
                color={selectedVenue?.meta.pets ? "info" : "disabled"}
              />
            </Stack>
            <Typography>Price: ${selectedVenue?.price}</Typography>
          </Container>
        </CardContent>
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
                    dayjs
                      .utc(booking.dateFrom)
                      .subtract(1, "day")
                      .startOf("day")
                  ) && day.isBefore(dayjs.utc(booking.dateTo).startOf("day"))
              );
            }}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={!token ? navigateToLogin : () => {}}
        >
          {!token ? "Login to Book" : "Check Availability"}
        </Button>
      </Card>
      {selectedVenue?.media?.length > 1 && (
        <ImageGallery media={selectedVenue?.media} />
      )}
      <Container
        disableGutters
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              alt={selectedVenue?.owner?.name}
              src={selectedVenue?.owner?.avatar}
            />
          }
          title={selectedVenue?.owner?.name}
        />
        <Box>
          <Typography>Created: {selectedVenue?.created}</Typography>
          {selectedVenue?.created !== selectedVenue?.updated && (
            <Typography>Updated: {selectedVenue.updated}</Typography>
          )}
        </Box>
      </Container>
    </Container>
  );
};

export default VenuePage;
