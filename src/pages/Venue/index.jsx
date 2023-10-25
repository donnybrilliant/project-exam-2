import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useVenueStore, useAuthStore, useFetchStore } from "../../stores";
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
  // Get states and actions from venuesStore
  const token = useAuthStore((state) => state.token);
  const selectedVenue = useVenueStore((state) => state.selectedVenue);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const isLoading = useFetchStore((state) => state.isLoading);
  const isError = useFetchStore((state) => state.isError);
  const bookVenue = useVenueStore((state) => state.bookVenue);
  const [dateRange, setDateRange] = useState([null, null]);
  const [guests, setGuests] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch venue when id changes
  useEffect(() => {
    fetchVenueById(id);
  }, [id]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error</h1>;

  //console.log(dateRange[0]);
  console.log(selectedVenue);

  const navigateToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  const handleBooking = () => {
    if (id && dateRange[0] && dateRange[1] && guests) {
      const bookingData = {
        venueId: id,
        dateFrom: dayjs(dateRange[0]).add(1, "day"),
        dateTo: dayjs(dateRange[1]).add(1, "day"),
        guests: Number(guests),
      };
      bookVenue(bookingData);
    }
  };

  return (
    <Container>
      <Card>
        {" "}
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
