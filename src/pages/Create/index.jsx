import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVenueStore } from "../../stores";
import ImageGallery from "../../components/ImageGallery";

import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button,
  Stack,
  TextField,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Map from "../../components/Map";

const CreateVenue = () => {
  const createVenue = useVenueStore((state) => state.createVenue);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaInput, setMediaInput] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [rating, setRating] = useState(0);
  const [meta, setMeta] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });

  const [location, setLocation] = useState({
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: 0,
    lng: 0,
  });

  const handleGeocode = async () => {
    const geocoder = new google.maps.Geocoder();
    const addressString = `${location.address}, ${location.city}, ${location.zip}, ${location.country}, ${location.continent}`;
    geocoder.geocode({ address: addressString }, (results, status) => {
      if (status === "OK") {
        const result = results[0];
        const { address_components } = result;
        const newLocation = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        };

        address_components.forEach((component) => {
          const { types, long_name } = component;
          if (types.includes("street_number") || types.includes("route")) {
            newLocation.address = long_name;
          } else if (types.includes("locality")) {
            newLocation.city = long_name;
          } else if (types.includes("postal_code")) {
            newLocation.zip = long_name;
          } else if (types.includes("country")) {
            newLocation.country = long_name;
          } else if (types.includes("continent")) {
            newLocation.continent = long_name;
          }
        });

        setLocation((prev) => ({
          ...prev,
          ...newLocation,
        }));
      } else {
        console.error(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  };

  const handleMetaChange = (event) => {
    setMeta({
      ...meta,
      [event.target.name]: event.target.checked,
    });
  };

  const handleMediaChange = (event, index) => {
    const newMedia = media.slice(); // Create a copy of the media array
    newMedia[index] = event.target.value; // Update the value at the specified index
    setMedia(newMedia); // Update the media state with the new array
  };

  const handleMediaSubmit = () => {
    if (mediaInput) {
      setMedia([...media, mediaInput]);
      setMediaInput("");
    }
  };

  const handleMediaDelete = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const venueData = {
      name,
      description,
      media,
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating,
      meta,
      location,
    };
    const response = await createVenue(venueData);
    navigate(`/venues/${response.id}`);
  };

  return (
    <Container maxWidth="md">
      <Card component="form" onSubmit={handleSubmit}>
        {media.length > 0 && (
          <CardMedia
            component="img"
            image={media[0]}
            alt={"Main Venue Image"}
            style={{ height: "450px" }}
          />
        )}
        <CardContent>
          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              rowGap: 2,
            }}
          >
            <TextField
              id="name"
              label="Name"
              type="text"
              variant="standard"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              inputProps={{ minLength: "3", maxLength: "50" }}
            />

            <Rating
              name="rating"
              value={rating}
              precision={0.2}
              style={{ marginBottom: 2 }}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Container>

          <TextField
            id="description"
            label="Description"
            multiline
            maxRows={10}
            variant="standard"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            id="maxGuests"
            label="Max Guests"
            type="number"
            variant="standard"
            inputProps={{ min: "1", max: "100" }}
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            fullWidth
          />

          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              marginBlock: 2,
            }}
          >
            <Stack
              direction="row"
              columnGap={2}
              sx={{
                marginTop: 2,
              }}
            >
              <Checkbox
                icon={<WifiIcon />}
                checkedIcon={<WifiIcon color="info" />}
                checked={meta.wifi}
                onChange={handleMetaChange}
                name="wifi"
              />
              <Checkbox
                icon={<LocalParkingIcon />}
                checkedIcon={<LocalParkingIcon color="info" />}
                checked={meta.parking}
                onChange={handleMetaChange}
                name="parking"
              />
              <Checkbox
                icon={<FreeBreakfastIcon />}
                checkedIcon={<FreeBreakfastIcon color="info" />}
                checked={meta.breakfast}
                onChange={handleMetaChange}
                name="breakfast"
              />
              <Checkbox
                icon={<PetsIcon />}
                checkedIcon={<PetsIcon color="info" />}
                checked={meta.pets}
                onChange={handleMetaChange}
                name="pets"
              />
            </Stack>

            <TextField
              id="price"
              label="Price"
              type="number"
              variant="standard"
              inputProps={{ min: "1" }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Container>
          <TextField
            id="mediaInput"
            label="Add Media URL"
            type="url"
            variant="standard"
            value={mediaInput}
            onChange={(e) => setMediaInput(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <IconButton
                  edge="end"
                  aria-label="Add Media URL"
                  onClick={handleMediaSubmit}
                >
                  <AddIcon />
                </IconButton>
              ),
            }}
          />
          {media.map((url, index) => (
            <TextField
              key={index}
              value={url}
              variant="standard"
              fullWidth
              onChange={(event) => handleMediaChange(event, index)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label="delete media URL"
                      onClick={() => handleMediaDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ))}
          <TextField
            id="address"
            label="Address"
            value={location.address}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, address: e.target.value }))
            }
            fullWidth
          />
          <TextField
            id="city"
            label="City"
            value={location.city}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, city: e.target.value }))
            }
            fullWidth
          />
          <TextField
            id="zip"
            label="ZIP Code"
            value={location.zip}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, zip: e.target.value }))
            }
            fullWidth
          />
          <TextField
            id="country"
            label="Country"
            value={location.country}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, country: e.target.value }))
            }
            fullWidth
          />
          <TextField
            id="continent"
            label="Continent"
            value={location.continent}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, continent: e.target.value }))
            }
            fullWidth
          />
          <Button onClick={handleGeocode} variant="outlined">
            Find Location
          </Button>
        </CardContent>
        <Button variant="contained" color="primary" fullWidth type="submit">
          Create Venue
        </Button>
      </Card>
      {media.length > 1 && <ImageGallery media={media} />}
      {location && <Map location={location} />}
    </Container>
  );
};

export default CreateVenue;
