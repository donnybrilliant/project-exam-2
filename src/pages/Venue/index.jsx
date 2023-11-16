import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  useVenueStore,
  useAuthStore,
  useFetchStore,
  useDialogStore,
  useProfileStore,
} from "../../stores";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Calendar from "../../components/Calendar";
import Map from "../../components/Map";
import ImageGallery from "../../components/ImageGallery";
import { Container, Card, Typography, Button, TextField } from "@mui/material";

import { VenuePageSkeleton } from "../../components/Skeletons";
import VenueDetails from "../../components/VenueDetails";
import VenueOwnerDetails from "../../components/VenueOwnerDetails";

dayjs.extend(utc);

// Venue page component
const VenuePage = () => {
  // Get id from URL
  let { id } = useParams();
  const { searchParams } = useVenueStore();

  // Get states and actions from venuesStore
  const token = useAuthStore((state) => state.token);
  const selectedVenue = useVenueStore((state) => state.selectedVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );

  const isLoading = useFetchStore((state) => state.isLoading);
  const bookVenue = useVenueStore((state) => state.bookVenue);
  const [bookingMade, setBookingMade] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);

  const [dateRange, setDateRange] = useState(() => {
    const startDate =
      searchParams.startDate && searchParams.startDate !== "null"
        ? dayjs(searchParams.startDate, "DD/MM/YY")
        : null;
    const endDate =
      searchParams.endDate && searchParams.endDate !== "null"
        ? dayjs(searchParams.endDate, "DD/MM/YY")
        : null;
    return [startDate, endDate];
  });

  const [guests, setGuests] = useState(searchParams?.guests || 1);

  const { openDialog } = useDialogStore();

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch venue when id changes
  useEffect(() => {
    fetchVenueById(id);
  }, [id]);

  document.title = selectedVenue?.name
    ? `${selectedVenue.name} - Holidaze`
    : "Venue - Holidaze";

  useEffect(() => {
    if (selectedVenue && token) {
      // Trigger the fetchProfileByName action with the owner's name
      fetchProfileByName(selectedVenue.owner.name);
    }
    return () => {
      // Clear profile data when component unmounts - is it neccessary when i have loading state on dashboard?
      useProfileStore.getState().clearSelectedProfile();
    };
  }, [selectedVenue]);

  // This shouldnt be needed.. But if not it scrolls to the bottom on load sometimes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //console.log(dateRange[0]);
  //console.log(selectedVenue?.bookings);
  //console.log(selectedProfile);

  const navigateToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  const handleBooking = () => {
    if (id && dateRange[0] && dateRange[1] && guests) {
      const bookingData = {
        name: selectedVenue?.name,
        venueId: id,
        dateFrom: dayjs(dateRange[0]).add(1, "day"),
        dateTo: dayjs(dateRange[1]).add(1, "day"),
        guests: Number(guests),
      };
      openDialog(
        // Add number of nights?
        `Book Venue: ${selectedVenue?.name}`,
        "Confirmation your booking details below:",
        `Dates: ${dayjs(bookingData?.dateFrom).format("DD/MM/YY")} - ${dayjs(
          bookingData?.dateTo
        ).format("DD/MM/YY")}. Guests: ${bookingData?.guests}`,
        async () => {
          console.log(bookingData);
          await bookVenue(bookingData);
          setDateRange([null, null]);
          setGuests(1);
          setBookingCount((prevCount) => prevCount + 1);
          // go to bookings page
        }
      );
    }
  };

  if (isLoading) return <VenuePageSkeleton />;
  if (!selectedVenue) {
    return <Typography>Venue Not Found</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Card>
        <VenueDetails venue={selectedVenue} />
        <Calendar
          key={bookingCount}
          selectedVenue={selectedVenue}
          dateRange={dateRange}
          setDateRange={setDateRange}
          bookingMade={bookingMade}
        />
        <Container
          sx={{
            width: "320px",
            textAlign: "right",
            marginBottom: 4,
            marginTop: -4,
          }}
        >
          <TextField
            id="guests"
            label="Number of Guests"
            type="number"
            variant="standard"
            inputProps={{ min: "1", max: selectedVenue?.maxGuests }}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            sx={{ width: "100px", marginRight: 1 }}
          />
        </Container>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={!token ? navigateToLogin : handleBooking}
        >
          {!token
            ? "Login to Book"
            : dateRange[0] === null || dateRange[1] === null
            ? "Select Dates to Book"
            : "Book"}
        </Button>
      </Card>

      <VenueOwnerDetails selectedVenue={selectedVenue} />
      {selectedVenue?.media?.length > 1 && (
        <ImageGallery media={selectedVenue?.media} />
      )}
      {selectedVenue?.location && <Map location={selectedVenue.location} />}
    </Container>
  );
};

export default VenuePage;
