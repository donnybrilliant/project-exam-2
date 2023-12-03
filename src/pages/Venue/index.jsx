import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  useVenueStore,
  useAuthStore,
  useFetchStore,
  useDialogStore,
  useProfileStore,
  useBookingStore,
  useSearchStore,
} from "../../stores";
import dayjs from "dayjs";
import Calendar from "../../components/Calendar";
import Map from "../../components/Map";
import ImageGallery from "../../components/ImageGallery";
import { Container, Card, Typography, Button, TextField } from "@mui/material";
import { VenuePageSkeleton } from "../../components/Skeletons";
import VenueDetails from "../../components/VenueDetails";
import VenueOwnerDetails from "../../components/VenueOwnerDetails";
import NotFound from "../../components/NotFound";

// Venue page component
const VenuePage = () => {
  // Get id from URL
  let { id } = useParams();
  const { searchParams } = useSearchStore();
  const { openDialog } = useDialogStore();

  // Get states and actions from venuesStore
  const token = useAuthStore((state) => state.token);
  const isLoading = useFetchStore((state) => state.isLoading);
  const selectedVenue = useVenueStore((state) => state.selectedVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );
  const bookVenue = useBookingStore((state) => state.bookVenue);

  // Local states for booking
  const [guests, setGuests] = useState(searchParams?.guests || 1);
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
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch venue when id changes
  useEffect(() => {
    fetchVenueById(id);
  }, [id]);

  // Update the document title and fetch profile by name when selectedVenue changes
  useEffect(() => {
    if (selectedVenue) {
      if (selectedVenue.name.trim() !== "") {
        const capitalizedName =
          selectedVenue?.name[0].toUpperCase() + selectedVenue?.name.slice(1);
        document.title = `${capitalizedName} - Holidaze`;
      } else {
        document.title = "Venue - Holidaze";
      }
      if (token) {
        fetchProfileByName(selectedVenue.owner.name);
      }
    }

    // Clean-up function to reset title or clear profile data if needed
    return () => {
      document.title = "Holidaze";
      // Optionally clear profile data here if necessary
    };
  }, [selectedVenue]);

  // This shouldnt be needed.. But if not it scrolls to the bottom on load sometimes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to login page if not logged in
  const navigateToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  // Handle booking confirmation
  const handleBookingConfirm = async (bookingData) => {
    console.log(bookingData);
    await bookVenue(bookingData);
    setDateRange([null, null]);
    setGuests(1);
    navigate("/dashboard");
  };

  // Open the confirmation dialog with booking details
  const handleBooking = () => {
    if (id && dateRange[0] && dateRange[1] && guests) {
      const pricePerNight = selectedVenue.price;
      const numberOfNights = dateRange[1].diff(dateRange[0], "day");
      const totalPrice = numberOfNights * pricePerNight;

      // Create the booking data object
      const bookingData = {
        name: selectedVenue?.name,
        venueId: id,
        dateFrom: dateRange[0],
        dateTo: dateRange[1],
        guests: Number(guests),
      };

      // Create the booking details for the dialog
      const bookingDetails = () => (
        <>
          <h3>Your booking details:</h3>
          <div>
            <strong>Number of nights:</strong> {numberOfNights}
          </div>
          <div>
            <strong>Dates:</strong> {bookingData.dateFrom.format("DD/MM/YY")} -{" "}
            {bookingData.dateTo.format("DD/MM/YY")}
          </div>
          <div>
            <strong>Guests:</strong> {bookingData.guests}
          </div>
          <div>
            <strong>Price per night:</strong> ${pricePerNight}
          </div>
          <div>
            <strong>Total price:</strong> ${totalPrice}
          </div>
        </>
      );

      openDialog(
        `Confirm Booking at ${selectedVenue?.name}`,
        "Please check your booking details, confirm and enjoy your Holidaze!",
        bookingDetails,
        () => handleBookingConfirm(bookingData)
      );
    }
  };

  // Should maybe change the logic of the loading here as it will show the skeleton when it loads for booking confirmation, which is not wanted.
  if (isLoading) return <VenuePageSkeleton />;
  if (!selectedVenue) {
    return <NotFound text="Venue Not Found" />;
  }

  return (
    <Container maxWidth="md">
      <Card>
        <VenueDetails venue={selectedVenue} />
        <Calendar
          selectedVenue={selectedVenue}
          dateRange={dateRange}
          setDateRange={setDateRange}
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
          <Container sx={{ marginRight: -1.5, mt: 3 }}>
            {dateRange[0] && dateRange[1] && (
              <>
                <Typography variant="body2">
                  Number of nights: {dateRange[1].diff(dateRange[0], "day")}
                </Typography>
                <Typography variant="body2">
                  Total price: $
                  {dateRange[1].diff(dateRange[0], "day") * selectedVenue.price}
                </Typography>
              </>
            )}
          </Container>
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
