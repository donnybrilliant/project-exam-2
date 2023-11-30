import { useVenueStore, useProfileStore, useAuthStore } from "../../stores";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
  Container,
  Typography,
  Button,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";

const VenueOwnerDetails = ({ selectedVenue }) => {
  const token = useAuthStore((state) => state.token);
  const isOwner = useVenueStore((state) => state.isOwner());
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const navigate = useNavigate();

  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginTop: 2,
      }}
    >
      <Tooltip
        title={
          token ? (
            <>
              <Typography variant="body2">
                Venues: {selectedProfile?._count.venues}
              </Typography>
              <Typography variant="body2">
                Bookings: {selectedProfile?._count.bookings}
              </Typography>
            </>
          ) : (
            "Login for more info"
          )
        }
        arrow
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBlock: 2,
            cursor: "default",
          }}
        >
          <Avatar
            alt={selectedVenue?.owner?.name}
            src={selectedVenue?.owner?.avatar}
            sx={{ marginRight: 1 }}
          />

          <Typography>{selectedVenue?.owner?.name}</Typography>
        </Box>
      </Tooltip>
      {isOwner && (
        <Button
          variant="outlined"
          onClick={() => navigate(`/venuemanager/edit/${selectedVenue?.id}`)}
        >
          Edit Venue
        </Button>
      )}
      <Box>
        <Typography>
          Created: {dayjs(selectedVenue?.created).format("DD/MM/YY")}
        </Typography>
        {selectedVenue?.created !== selectedVenue?.updated && (
          <Typography>
            Updated: {dayjs(selectedVenue?.updated).format("DD/MM/YY")}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default VenueOwnerDetails;
