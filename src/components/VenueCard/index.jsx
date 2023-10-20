import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Button,
  CardActionArea,
  CardActions,
  Rating,
  Container,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const VenueCard = ({ venue }) => {
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
          <IconButton
            size="small"
            aria-label="Close"
            onClick={() => setOpenImageIndex(null)}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
            }}
          >
            <FavoriteBorderIcon />
          </IconButton>
          <Container
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              gutterBottom
              sx={{ textTransform: "capitalize", textOverflow: "ellipsis" }}
            >
              {venue.name}
            </Typography>
            <Rating
              size="small"
              name="half-rating-read"
              defaultValue={venue.rating}
              precision={0.5}
              readOnly
            />
          </Container>
          <Container
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
              <PlaceIcon fontSize="small" />
              {venue.location.city === "" ? "Unknown" : venue.location.city}
            </Typography>

            <Typography>$ {venue.price}</Typography>
          </Container>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Box>
          {venue.meta.wifi && <WifiIcon fontSize="small" />}
          {venue.meta.parking && <LocalParkingIcon fontSize="small" />}
          {venue.meta.breakfast && <FreeBreakfastIcon fontSize="small" />}
          {venue.meta.pets && <PetsIcon fontSize="small" />}
        </Box>
        <Button size="small" color="primary">
          Check Availability
        </Button>
      </CardActions>
    </Card>
  );
};

export default VenueCard;
