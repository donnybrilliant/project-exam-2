import { useEffect, useState } from "react";
import { useProfileStore, useFetchStore } from "../../stores";
import {
  Avatar,
  Typography,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Container,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LoadingButton from "@mui/lab/LoadingButton";

const UserInfo = () => {
  const [isAvatarFieldVisible, setIsAvatarFieldVisible] = useState(false);
  const [avatar, setAvatar] = useState("");
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const updateAvatar = useProfileStore((state) => state.updateAvatar);
  const isLoading = useFetchStore((state) => state.isLoading);

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
                <LoadingButton onClick={handleAvatarUpdate} loading={isLoading}>
                  Save
                </LoadingButton>
              </InputAdornment>
            ),
          }}
        />
      )}
      <Container sx={{ marginBlock: 2 }}>
        <Typography>
          {isLoading ? (
            <Skeleton width={160} sx={{ marginInline: "auto" }} />
          ) : (
            `Username: ${selectedProfile?.name}`
          )}
        </Typography>
        <Typography>
          {isLoading ? (
            <Skeleton width={160} sx={{ marginInline: "auto" }} />
          ) : (
            `Email: ${selectedProfile?.email}`
          )}
        </Typography>
        <Typography>
          {isLoading ? (
            <Skeleton width={160} sx={{ marginInline: "auto" }} />
          ) : (
            `Venue Manager: ${selectedProfile?.venueManager ? "Yes" : "No"}`
          )}
        </Typography>
      </Container>
    </>
  );
};

export default UserInfo;
