import { useState } from "react";
import { useFetchStore, useVenueStore } from "../../stores";
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
  Typography,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const CreateVenue = () => {
  const createVenue = useVenueStore((state) => state.createVenue);
  const isError = useFetchStore((state) => state.isError);
  const errorMsg = useFetchStore((state) => state.errorMsg);
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

  const handleSubmit = () => {
    const venueData = {
      name,
      description,
      media,
      price: Number(price),
      maxGuests: Number(maxGuests),
      rating,
      meta,
    };
    createVenue(venueData);
    console.log(venueData);
  };

  return (
    <Container>
      <Card>
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
              alignItems: "flex-center",
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
          />

          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Stack direction="row" spacing={2}>
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
          </Container>
        </CardContent>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Create Venue
        </Button>
        {isError && <Typography>{errorMsg}</Typography>}
      </Card>
      {media.length > 1 && <ImageGallery media={media} />}
    </Container>
  );
};

export default CreateVenue;
