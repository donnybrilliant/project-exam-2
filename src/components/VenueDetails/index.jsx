import {
  Container,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Stack,
  Box,
  Tooltip,
  Link,
  Button,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import PlaceIcon from "@mui/icons-material/Place";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavoritesStore, useAuthStore } from "../../stores";

const VenueDetails = ({ venue }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(venue.id);
  const token = useAuthStore((state) => state.token);

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(venue.id);
    } else {
      addFavorite(venue.id);
    }
  };

  return (
    <>
      {venue?.media.length > 0 ? (
        <CardMedia
          component="img"
          height="350"
          image={venue?.media[0]}
          alt={venue?.name}
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
            {venue?.name}
          </Typography>
          <Rating
            name="venue-rating"
            value={venue?.rating ?? 0}
            precision={0.5}
            readOnly
            style={{ marginLeft: -2 }}
          />
        </Container>
        <Container
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
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
            {venue?.location.city === "" ? "Unknown" : venue?.location.city}
            {venue?.location.country === ""
              ? ""
              : ", " + venue?.location.country}
          </Link>
          {token && (
            <Button
              startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleToggleFavorite}
            >
              {favorite ? "In Favorites" : "Add to Favorites"}
            </Button>
          )}
        </Container>
        <Typography variant="h2">Description:</Typography>
        <Typography sx={{ marginBlock: 1 }}>{venue?.description}</Typography>

        <Typography color="text.secondary" align="right" sx={{ py: 2 }}>
          Max Guests: {venue?.maxGuests}
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
            <Tooltip title={venue?.meta.wifi ? "Has Wifi" : "No Wifi"} arrow>
              <WifiIcon
                fontSize="large"
                color={venue?.meta.wifi ? "" : "disabled"}
              />
            </Tooltip>
            <Tooltip
              title={venue?.meta.parking ? "Has Parking" : "No Parking"}
              arrow
            >
              <LocalParkingIcon
                fontSize="large"
                color={venue?.meta.parking ? "" : "disabled"}
              />
            </Tooltip>
            <Tooltip
              title={
                venue?.meta.breakfast ? "Breakfast included" : "No Breakfast"
              }
              arrow
            >
              <FreeBreakfastIcon
                fontSize="large"
                color={venue?.meta.breakfast ? "" : "disabled"}
              />
            </Tooltip>
            <Tooltip
              title={venue?.meta.pets ? "Pets allowed" : "No Pets"}
              arrow
            >
              <PetsIcon
                fontSize="large"
                color={venue?.meta.pets ? "" : "disabled"}
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
              ${venue?.price}
            </Typography>
          </Typography>
        </Container>
      </CardContent>
    </>
  );
};

export default VenueDetails;
