import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import useVenuesStore from "../../stores/venuesStore";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Rating,
  Avatar,
  Button,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";

// Venue page component
const VenuePage = () => {
  // Get id from URL
  let { id } = useParams();
  // Get token from authStore
  const { token } = useAuthStore();
  // Get states and actions from venuesStore
  const { selectedVenue, isLoading, isError, fetchVenueById } =
    useVenuesStore();

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
          style={{ height: "300px" }} // Increased height for better image display
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {selectedVenue?.name}
          </Typography>
          <Rating
            name="venue-rating"
            value={selectedVenue?.rating}
            precision={0.5}
            readOnly
            style={{ marginBottom: "8px" }} // Margin for better spacing
          />
          <Typography variant="body2" color="text.secondary">
            {selectedVenue?.description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 1 }}>
              <PetsIcon />
            </Avatar>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              Price: ${selectedVenue?.price}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            {selectedVenue?.meta.wifi && <WifiIcon sx={{ mr: 1 }} />}
            {selectedVenue?.meta.parking && <LocalParkingIcon sx={{ mr: 1 }} />}
            {selectedVenue?.meta.breakfast && (
              <FreeBreakfastIcon sx={{ mr: 1 }} />
            )}
            {selectedVenue?.meta.pets && <PetsIcon sx={{ mr: 1 }} />}
          </Box>
        </CardContent>
        <Button variant="contained" color="primary" fullWidth>
          Check Availability
        </Button>
      </Card>
    </Container>
  );
};

export default VenuePage;
