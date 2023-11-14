import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Rating,
  Container,
  Box,
  IconButton,
  Typography,
  Tooltip,
  Stack,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuthStore } from "../../stores";

// This component is used to display a venue card
const VenueCard = ({ venue }) => {
  const token = useAuthStore((state) => state.token);

  if (venue) {
    return (
      <Card>
        <CardActionArea component={Link} to={`/venues/${venue.id}`}>
          {venue.media.length > 0 ? (
            <CardMedia
              component="img"
              height="140"
              image={venue.media[0]}
              alt={venue.name}
            />
          ) : (
            <Box
              sx={{
                height: 140,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No photo
            </Box>
          )}

          <CardContent>
            {token && (
              <IconButton
                size="small"
                aria-label="Favorite"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 2,
                }}
              >
                <FavoriteBorderIcon />
              </IconButton>
            )}
            <Container
              disableGutters
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginBottom: 1,
                gap: 1,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  textTransform: "capitalize",
                  width: "210px",
                }}
              >
                {venue.name}
              </Typography>
              <Rating
                size="small"
                name="half-rating-read"
                defaultValue={venue.rating}
                precision={0.5}
                readOnly
                sx={{ marginInline: -0.5 }}
              />
            </Container>
            <Container
              disableGutters
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Typography
                color="text.secondary"
                sx={{
                  textTransform: "capitalize",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: -0.5,
                }}
              >
                <PlaceIcon fontSize="small" />
                {venue.location.city === "" ? "Unknown" : venue.location.city}
              </Typography>

              <Typography>$ {venue.price}</Typography>
            </Container>
          </CardContent>
        </CardActionArea>
        <CardActions
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ marginInline: 1 }}>
            <Tooltip title={venue?.meta.wifi ? "Has Wifi" : "No Wifi"} arrow>
              <WifiIcon
                fontSize="small"
                color={venue?.meta.wifi ? "" : "disabled"}
              />
            </Tooltip>
            <Tooltip
              title={venue?.meta.parking ? "Has Parking" : "No Parking"}
              arrow
            >
              <LocalParkingIcon
                fontSize="small"
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
                fontSize="small"
                color={venue?.meta.breakfast ? "" : "disabled"}
              />
            </Tooltip>
            <Tooltip
              title={venue?.meta.pets ? "Pets allowed" : "No Pets"}
              arrow
            >
              <PetsIcon
                fontSize="small"
                color={venue?.meta.pets ? "" : "disabled"}
              />
            </Tooltip>
          </Stack>
          <Button size="small" color="primary">
            Check Availability
          </Button>
        </CardActions>
      </Card>
    );
  }
};

export default VenueCard;
