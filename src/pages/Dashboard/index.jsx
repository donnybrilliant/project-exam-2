import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuthStore, useProfileStore, useVenueStore } from "../../stores";
import { useDialogStore } from "../../stores"; // Adjust path as necessary
import {
  Avatar,
  Container,
  Typography,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  TextField,
  InputAdornment,
  Chip,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { People, Person } from "@mui/icons-material";
import dayjs from "dayjs";

const Dashboard = () => {
  const [isAvatarFieldVisible, setIsAvatarFieldVisible] = useState(false);
  const [avatar, setAvatar] = useState("");

  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const updateAvatar = useProfileStore((state) => state.updateAvatar);
  const deleteVenue = useVenueStore((state) => state.deleteVenue);
  const deleteBooking = useVenueStore((state) => state.deleteBooking);
  const { openDialog } = useDialogStore();

  const toggleAvatarField = () => {
    setIsAvatarFieldVisible((prev) => !prev);
  };

  const handleAvatarUpdate = async () => {
    await updateAvatar(avatar);
    setIsAvatarFieldVisible(false);
  };

  const handleDeleteClickBooking = async (bookingId) => {
    const booking = selectedProfile?.bookings.find(
      (booking) => booking.id === bookingId
    );
    openDialog(
      `Cancel Booking at ${booking?.venue.name}`,
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      `Dates: ${dayjs(booking?.dateFrom).format("DD/MM/YY")} - ${dayjs(
        booking?.dateTo
      ).format("DD/MM/YY")}. Guests: ${booking?.guests}`,
      async () => {
        await deleteBooking(bookingId, booking?.venue.name);
      }
    );
  };

  const handleDeleteClickVenue = (venueId) => {
    const venue = selectedProfile?.venues.find((venue) => venue.id === venueId);
    // TODO: I need to fetch venue to get bookings..
    openDialog(
      `Delete Venue: ${venueToDeleteName}`,
      "Are you sure you want to delete this venue? This action cannot be undone.",
      `You have ${
        venue?.bookings?.length ? venue.bookings.length : "0"
      } upcoming bookings for this venue.`,
      async () => {
        await deleteVenue(venueId, venue?.name);
      }
    );
  };

  useEffect(() => {
    fetchProfileByName(userName);
  }, [userName]);

  useEffect(() => {
    if (selectedProfile) {
      setAvatar(selectedProfile.avatar);
    }
  }, [selectedProfile]);

  //console.log(selectedProfile);
  return (
    <>
      <Container sx={{ textAlign: "center" }}>
        <Typography>Dashboard</Typography>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ m: 4 }}
          badgeContent={
            <IconButton sx={{ bgcolor: "#d3d3d3" }} onClick={toggleAvatarField}>
              <EditIcon />
            </IconButton>
          }
        >
          <Avatar
            alt={selectedProfile?.name}
            src={avatar}
            sx={{ width: "100px", height: "100px" }}
          />
        </Badge>
        {isAvatarFieldVisible && (
          <TextField
            margin="normal"
            fullWidth
            id="avatar"
            label="Avatar URL"
            name="avatar"
            value={avatar || ""}
            onChange={(e) => setAvatar(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleAvatarUpdate}>Save</Button>
                </InputAdornment>
              ),
            }}
          />
        )}

        <Typography>Username: {selectedProfile?.name}</Typography>
        <Typography>Email: {selectedProfile?.email}</Typography>
        <Typography>
          VenueManager: {selectedProfile?.venueManager ? "Yes" : "No"}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to={"/dashboard/venues/create"}
        >
          Create Venue
        </Button>
        <h2>Your Bookings</h2>
        <List>
          {selectedProfile?.bookings.map((booking) => (
            <Fragment key={booking.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    alt={booking?.venue.name}
                    src={booking?.venue.media[0]}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    textTransform: "capitalize",
                  }}
                  primary={booking?.venue.name}
                  secondary={
                    dayjs
                      .utc(booking?.dateFrom)
                      .startOf("day")
                      .format("DD/MM/YY") +
                    " - " +
                    dayjs
                      .utc(booking?.dateTo)

                      .endOf("day")
                      .format("DD/MM/YY")
                  }
                />

                <ListItemSecondaryAction>
                  <Chip
                    sx={{ mr: 2 }}
                    icon={booking?.guests === 1 ? <Person /> : <People />}
                    label={booking?.guests}
                  />
                  <IconButton
                    onClick={() => handleDeleteClickBooking(booking.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <Button component={Link} to={`/venues/${booking.venue.id}`}>
                    View
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
        <h2>Your Venues</h2>
        <List>
          {selectedProfile?.venues.map((venue) => (
            <Fragment key={venue.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar alt={venue?.name} src={venue?.media[0]} />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    textTransform: "capitalize",
                  }}
                  primary={venue?.name || "No venue name - please update"}
                  secondary={
                    "Rating: " + venue?.rating + " Price: " + venue?.price
                  }
                />
                <IconButton onClick={() => handleDeleteClickVenue(venue.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton component={Link} to={`/venues/${venue.id}/edit`}>
                  <EditIcon />
                </IconButton>
                <Button component={Link} to={`/venues/${venue.id}`}>
                  View
                </Button>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Container>
    </>
  );
};

export default Dashboard;
