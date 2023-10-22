import { useEffect } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Dashboard = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );
  const isLoading = useFetchStore((state) => state.isLoading);
  const isError = useFetchStore((state) => state.isError);
  const selectedProfile = useProfileStore((state) => state.selectedProfile);

  // Fetch venue when userName changes
  useEffect(() => {
    fetchProfileByName(userName);
  }, [userName]);

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
          <IconButton sx={{ bgcolor: "#d3d3d3" }}>
            <EditIcon />
          </IconButton>
        }
      >
        <Avatar sx={{ width: "100px", height: "100px" }} />
      </Badge>
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
    </Container>
  );
};

export default Dashboard;
