import { useEffect, useState } from "react";
import { useProfileStore, useFetchStore } from "../../stores";
import LoadingButton from "@mui/lab/LoadingButton";
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

// This component is used to display the user info
const UserInfo = ({ userInfo }) => {
  const isLoading = useFetchStore((state) => state.isLoading);
  const updateAvatar = useProfileStore((state) => state.updateAvatar);
  const [isAvatarFieldVisible, setIsAvatarFieldVisible] = useState(false);
  const [avatar, setAvatar] = useState("");

  // This function is used to toggle the avatar field
  const toggleAvatarField = () => {
    setIsAvatarFieldVisible((prev) => !prev);
  };

  // This function is used to update the avatar
  const handleAvatarUpdate = async () => {
    await updateAvatar(avatar);
    setIsAvatarFieldVisible(false);
  };

  // Update the avatar state whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      setAvatar(userInfo.avatar);
    }
  }, [userInfo]);

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
          alt={userInfo.name}
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
            `Username: ${userInfo.name}`
          )}
        </Typography>
        <Typography>
          {isLoading ? (
            <Skeleton width={160} sx={{ marginInline: "auto" }} />
          ) : (
            `Email: ${userInfo.email}`
          )}
        </Typography>
        <Typography>
          {isLoading ? (
            <Skeleton width={160} sx={{ marginInline: "auto" }} />
          ) : (
            `Venue Manager: ${userInfo.venueManager ? "Yes" : "No"}`
          )}
        </Typography>
      </Container>
    </>
  );
};

export default UserInfo;
