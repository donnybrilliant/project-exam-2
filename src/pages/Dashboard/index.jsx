import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useAuthStore,
  useProfileStore,
  useFetchStore,
  useVenueStore,
} from "../../stores";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Box,
  Chip,
  ListItemSecondaryAction,
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
  const isLoading = useFetchStore((state) => state.isLoading);
  const isError = useFetchStore((state) => state.isError);
  const errorMsg = useFetchStore((state) => state.errorMsg);
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const updateAvatar = useProfileStore((state) => state.updateAvatar);
  const deleteVenue = useVenueStore((state) => state.deleteVenue);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [venueToDeleteName, setVenueToDeleteName] = useState("");
  const deleteBooking = useVenueStore((state) => state.deleteBooking);

  const handleDeleteClickBooking = async (bookingId) => {
    await deleteBooking(bookingId);
  };
  const handleDeleteClick = (venueId) => {
    const venue = selectedProfile?.venues.find((venue) => venue.id === venueId);
    setVenueToDelete(venueId);
    setVenueToDeleteName(venue?.name); // Save venue name
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteVenue(venueToDelete); // await to ensure completion before fetching
    await fetchProfileByName(userName); // Re-fetch profile data
    setDeleteDialogOpen(false);
    setSnackbarMessage(`Successfully deleted ${venueToDeleteName}.`);
    setSnackbarOpen(true);
  };

  // Check docs for opening and closing snackbars and modals
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const toggleAvatarField = () => {
    setIsAvatarFieldVisible((prev) => !prev);
  };

  const handleAvatarUpdate = async () => {
    await updateAvatar(avatar);
    setIsAvatarFieldVisible(false);
  };

  // Fetch venue when userName changes
  useEffect(() => {
    fetchProfileByName(userName);
  }, [userName]);

  useEffect(() => {
    if (selectedProfile) {
      setAvatar(selectedProfile.avatar);
    }
  }, [selectedProfile]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>{errorMsg}</h1>;

  console.log(selectedProfile);

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

        <List>
          {selectedProfile?.bookings.map((booking) => (
            <ListItem key={booking.id}>
              <ListItemAvatar>
                <Avatar
                  alt={booking?.venue.name}
                  src={booking?.venue.media[0]}
                />
              </ListItemAvatar>
              <ListItemText
                primary={booking?.venue.name}
                secondary={
                  dayjs(booking?.dateFrom).format("DD/MM/YY") +
                  " - " +
                  dayjs(booking?.dateTo).format("DD/MM/YY")
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
          ))}
        </List>
        <List>
          {selectedProfile?.venues.map((venue) => (
            <ListItem key={venue.id}>
              <ListItemAvatar>
                <Avatar alt={venue?.name} src={venue?.media[0]} />
              </ListItemAvatar>
              <ListItemText
                primary={venue?.name || "No venue name - please update"}
                secondary={
                  "Rating: " + venue?.rating + " Price: " + venue?.price
                }
              />
              <IconButton onClick={() => handleDeleteClick(venue.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton component={Link} to={`/venues/${venue.id}/edit`}>
                <EditIcon />
              </IconButton>
              <Button component={Link} to={`/venues/${venue.id}`}>
                View
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Venue"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this venue? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
