import {
  Avatar,
  Container,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuthStore } from "../../stores";

const Dashboard = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  return (
    <Container sx={{ textAlign: "center" }}>
      <Typography>Login</Typography>
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
      <Typography>Username: {userInfo.name}</Typography>
      <Typography>Email: {userInfo.email}</Typography>
      <Typography>
        VenueManager: {userInfo.venueManager ? "Yes" : "No"}
      </Typography>
    </Container>
  );
};

export default Dashboard;
