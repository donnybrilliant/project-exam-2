import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import useVenueStore from "../../stores/venueStore";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Button,
  Stack,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import ImageGallery from "../../components/ImageGallery";

// Venue page component
const VenuePage = () => {
  // Get id from URL
  let { id } = useParams();
  // Get token from authStore
  const { token } = useAuthStore();
  // Get states and actions from venuesStore
  const { selectedVenue, isLoading, isError, fetchVenueById } = useVenueStore();

  // Fetch venue when id, token and fetchVenueById function change
  useEffect(() => {
    fetchVenueById(id, token);
  }, [id, token, fetchVenueById]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error</h1>;

  console.log(selectedVenue);

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          image={selectedVenue?.media[0]}
          alt={selectedVenue?.name}
          style={{ height: "300px" }}
        />
        <CardContent>
          <Container
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="h5" component="div">
              {selectedVenue?.name}
            </Typography>
            <Rating
              name="venue-rating"
              value={selectedVenue?.rating}
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
            }}
          >
            <Stack direction="row" spacing={2}>
              <WifiIcon
                color={selectedVenue?.meta.wifi ? "info" : "disabled"}
              />
              <LocalParkingIcon
                color={selectedVenue?.meta.wifi ? "info" : "disabled"}
              />
              <FreeBreakfastIcon
                color={selectedVenue?.meta.wifi ? "info" : "disabled"}
              />
              <PetsIcon
                color={selectedVenue?.meta.wifi ? "info" : "disabled"}
              />
            </Stack>
            <Typography>Price: ${selectedVenue?.price}</Typography>
          </Container>
        </CardContent>
        <Button variant="contained" color="primary" fullWidth>
          Check Availability
        </Button>
      </Card>
      {selectedVenue?.media?.length > 1 && (
        <ImageGallery media={selectedVenue?.media} />
      )}
      <Typography>Created: {selectedVenue?.created}</Typography>
      {selectedVenue?.created !== selectedVenue?.updated && (
        <Typography>Updated: {selectedVenue.updated}</Typography>
      )}
    </Container>
  );
};

export default VenuePage;
