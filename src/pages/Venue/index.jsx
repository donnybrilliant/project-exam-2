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
  TextField,
  Tooltip,
  Link,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import PlaceIcon from "@mui/icons-material/Place";

dayjs.extend(utc);

// Venue page component
const VenuePage = () => {
  // Get id from URL
  let { id } = useParams();
  const { searchParams } = useVenueStore();

  // Get states and actions from venuesStore
  const token = useAuthStore((state) => state.token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const selectedVenue = useVenueStore((state) => state.selectedVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const isLoading = useFetchStore((state) => state.isLoading);
  const bookVenue = useVenueStore((state) => state.bookVenue);
  const [dateRange, setDateRange] = useState([null, null]);
  const [guests, setGuests] = useState(1);
  const [bookingMade, setBookingMade] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);

  const { openDialog } = useDialogStore();

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch venue when id changes
  useEffect(() => {
    fetchVenueById(id);
  }, [id]);

  const isOwner = selectedVenue?.owner?.name === userInfo?.name;

  useEffect(() => {
    if (selectedVenue) {
      // Trigger the fetchProfileByName action with the owner's name
      fetchProfileByName(selectedVenue.owner.name);
    }
  }, [selectedVenue]);

  // need correct date format for calendar...
  /*  useEffect(() => {
    // Check if there are values in the store
    if (searchParams.startDate && searchParams.endDate) {
      const start = dayjs(searchParams.startDate);
      const end = dayjs(searchParams.endDate);
      setDateRange([start.toDate(), end.toDate()]);
    }
    if (searchParams.guests) {
      setGuests(searchParams.guests);
    }
    // ... rest of your code ...
  }, [searchParams]); */

  //if (isLoading) return <h1>Loading...</h1>;

  //console.log(dateRange[0]);
  console.log(selectedVenue);
  console.log(selectedProfile);

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
          await bookVenue(bookingData);
          setDateRange([null, null]);
          setGuests(1);
          setBookingCount((prevCount) => prevCount + 1);
        }
      );
    }
  };

  return (
    <Container maxWidth="md">
      <Card>
        {selectedVenue?.media.length > 0 ? (
          <CardMedia
            component="img"
            height="350"
            image={selectedVenue?.media[0]}
            alt={selectedVenue?.name}
          />
        ) : (
          <Box
            sx={{
              height: 350,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            No photo
          </Box>
        )}
        <CardContent>
          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 1,
              gap: 1,
            }}
          >
            <Typography variant="h1" component="div">
              {selectedVenue?.name}
            </Typography>
            <Rating
              name="venue-rating"
              value={selectedVenue?.rating ?? 0}
              precision={0.5}
              readOnly
              style={{ marginLeft: -2 }}
            />
          </Container>
          <Link
            href="#map"
            color="text.secondary"
            sx={{
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              marginLeft: -0.5,
              marginBlock: 2,
            }}
          >
            <PlaceIcon fontSize="small" />
            {selectedVenue?.location.city === ""
              ? "Unknown"
              : selectedVenue?.location.city}
            {selectedVenue?.location.country === ""
              ? ""
              : ", " + selectedVenue?.location.country}
          </Link>
          <Typography variant="h2">Description:</Typography>
          <Typography sx={{ marginBlock: 1 }}>
            {selectedVenue?.description}
          </Typography>

          <Typography color="text.secondary" align="right" sx={{ py: 2 }}>
            Max Guests: {selectedVenue?.maxGuests}
          </Typography>

          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              marginBottom: 5,
            }}
          >
            <Stack direction="row" spacing={2}>
              <Tooltip
                title={selectedVenue?.meta.wifi ? "Has Wifi" : "No Wifi"}
                arrow
              >
                <WifiIcon
                  fontSize="large"
                  color={selectedVenue?.meta.wifi ? "" : "disabled"}
                />
              </Tooltip>
              <Tooltip
                title={
                  selectedVenue?.meta.parking ? "Has Parking" : "No Parking"
                }
                arrow
              >
                <LocalParkingIcon
                  fontSize="large"
                  color={selectedVenue?.meta.parking ? "" : "disabled"}
                />
              </Tooltip>
              <Tooltip
                title={
                  selectedVenue?.meta.breakfast
                    ? "Breakfast included"
                    : "No Breakfast"
                }
                arrow
              >
                <FreeBreakfastIcon
                  fontSize="large"
                  color={selectedVenue?.meta.breakfast ? "" : "disabled"}
                />
              </Tooltip>
              <Tooltip
                title={selectedVenue?.meta.pets ? "Pets allowed" : "No Pets"}
                arrow
              >
                <PetsIcon
                  fontSize="large"
                  color={selectedVenue?.meta.pets ? "" : "disabled"}
                />
              </Tooltip>
            </Stack>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ textDecoration: "underline" }}>
                Price per night:
              </span>
              <Typography variant="price" sx={{ marginLeft: 0.5 }}>
                ${selectedVenue?.price}
              </Typography>
            </Typography>
          </Container>
        </CardContent>
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
          {!token ? "Login to Book" : "Book"}
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
        <Tooltip
          title={
            <>
              <Typography variant="body2">
                Venues: {selectedProfile?._count.venues}
              </Typography>
              <Typography variant="body2">
                Bookings: {selectedProfile?._count.bookings}
              </Typography>
            </>
          }
          arrow
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBlock: 2,
              cursor: "default",
            }}
          >
            <Avatar
              alt={selectedVenue?.owner?.name}
              src={selectedVenue?.owner?.avatar}
              sx={{ marginRight: 1 }}
            />

            <Typography>{selectedVenue?.owner?.name}</Typography>
          </Box>
        </Tooltip>
        {isOwner && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/venues/${selectedVenue?.id}/edit`)}
          >
            Edit Venue
          </Button>
        )}
        <Box>
          <Typography>
            Created:{" "}
            {dayjs.utc(selectedVenue?.created).endOf("day").format("DD/MM/YY")}
          </Typography>
          {selectedVenue?.created !== selectedVenue?.updated && (
            <Typography>
              Updated:{" "}
              {dayjs
                .utc(selectedVenue?.updated)
                .endOf("day")
                .format("DD/MM/YY")}
            </Typography>
          )}
        </Box>
      </Container>
      {selectedVenue?.location && <Map location={selectedVenue.location} />}
    </Container>
  );
};

export default VenuePage;
