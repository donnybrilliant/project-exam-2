import { useEffect, useState } from "react";
import { useAuthStore, useProfileStore, useFetchStore } from "../../stores";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

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
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const updateAvatar = useProfileStore((state) => state.updateAvatar);

  const toggleAvatarField = () => {
    setIsAvatarFieldVisible((prev) => !prev);
  };

  const handleAvatarUpdate = async () => {
    await updateAvatar(avatar);
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
  if (isError) return <h1>Error</h1>;

  console.log(selectedProfile);

  return (
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
          label="Avatar"
          name="avatar"
          value={avatar}
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

      <List>
        {selectedProfile?.bookings.map((booking) => (
          <ListItem key={booking.id} secondaryAction={<Button>View</Button>}>
            <ListItemAvatar>
              <Avatar alt={booking?.venue.name} src={booking?.venue.media[0]} />
            </ListItemAvatar>
            <ListItemText
              primary={booking?.venue.name}
              secondary={booking?.dateFrom + " - " + booking.dateTo}
            />
          </ListItem>
        ))}
      </List>
      {/*  <List>
        {selectedProfile?.venues.map((venue) => (
          <ListItem key={venue.id} secondaryAction={<Button>View</Button>}>
            <ListItemAvatar>
              <Avatar alt={venue?.venue.name} src={venue?.venue.media[0]} />
            </ListItemAvatar>
            <ListItemText
              primary={venue?.venue.name}
              secondary={venue?.dateFrom + " - " + venue.dateTo}
            />
          </ListItem>
        ))}
      </List> */}
    </Container>
  );
};

export default Dashboard;
