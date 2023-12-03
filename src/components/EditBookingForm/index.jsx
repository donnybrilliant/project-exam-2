import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Calendar from "../Calendar";
import dayjs from "dayjs";
import { useBookingStore } from "../../stores";

const EditBookingForm = ({ booking, venueData }) => {
  const { setGuests, setDateRange } = useBookingStore();
  const [localDateRange, setLocalDateRange] = useState([
    dayjs(booking.dateFrom),
    dayjs(booking.dateTo),
  ]);
  const [localGuests, setLocalGuests] = useState(booking.guests);

  // Handle local state changes
  const handleDateRangeChange = (newDateRange) => {
    setLocalDateRange(newDateRange);
  };

  const handleGuestsChange = (e) => {
    setLocalGuests(Number(e.target.value));
  };

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

export default EditBookingForm;
