import { useEffect, useState } from "react";
import { useBookingStore } from "../../stores";
import dayjs from "dayjs";
import Calendar from "../Calendar";
import { TextField } from "@mui/material";

// Booking form component for dialog use
const BookingForm = ({ booking, venueData }) => {
  const { setGuests, setDateRange } = useBookingStore();

  // Determine initial values based on whether we're editing an existing booking
  const initialDateRange = booking
    ? [dayjs(booking.dateFrom), dayjs(booking.dateTo)]
    : [null, null];
  const initialGuests = booking ? booking.guests : 1;

  const [localDateRange, setLocalDateRange] = useState(initialDateRange);
  const [localGuests, setLocalGuests] = useState(initialGuests);

  // Handle local state changes
  const handleDateRangeChange = (newDateRange) => {
    setLocalDateRange(newDateRange);
  };

  const handleGuestsChange = (e) => {
    setLocalGuests(Number(e.target.value));
  };

  // Update global state when local state changes
  useEffect(() => {
    setDateRange(localDateRange);
    setGuests(localGuests);
  }, [localDateRange, localGuests, setDateRange, setGuests]);

  return (
    <>
      <Calendar
        selectedVenue={venueData}
        dateRange={localDateRange}
        setDateRange={handleDateRangeChange}
        currentBooking={booking}
      />
      <TextField
        label="Number of Guests"
        type="number"
        value={localGuests}
        onChange={handleGuestsChange}
        inputProps={{ min: 1, max: venueData?.maxGuests }}
      />
    </>
  );
};

export default BookingForm;
