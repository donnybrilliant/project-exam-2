import { useEffect, useState } from "react";
import { useProfileStore } from "../../stores";
import {
  Avatar,
  Typography,
  IconButton,
  Badge,
  Button,
  TextField,
  InputAdornment,
  Container,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UserInfo = () => {
  const [isAvatarFieldVisible, setIsAvatarFieldVisible] = useState(false);
  const [avatar, setAvatar] = useState("");
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const updateAvatar = useProfileStore((state) => state.updateAvatar);

  const toggleAvatarField = () => {
    setIsAvatarFieldVisible((prev) => !prev);
  };

  const handleAvatarUpdate = async () => {
    await updateAvatar(avatar);
    setIsAvatarFieldVisible(false);
  };
  useEffect(() => {
    if (selectedProfile) {
      setAvatar(selectedProfile.avatar);
    }
  }, [selectedProfile]);
  return (
    <>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ marginBlock: 2 }}
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
      <Container sx={{ marginBlock: 2 }}>
        <Typography>Username: {selectedProfile?.name}</Typography>
        <Typography>Email: {selectedProfile?.email}</Typography>
        <Typography>
          VenueManager: {selectedProfile?.venueManager ? "Yes" : "No"}
        </Typography>
      </Container>
    </>
  );
};

export default UserInfo;
