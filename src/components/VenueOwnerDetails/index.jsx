import { useVenueStore, useProfileStore, useAuthStore } from "../../stores";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Box,
  Tooltip,
} from "@mui/material";

dayjs.extend(utc);

const VenueOwnerDetails = ({ selectedVenue }) => {
  const token = useAuthStore((state) => state.token);
  const isOwner = useVenueStore((state) => state.isOwner());
  const selectedProfile = useProfileStore((state) => state.selectedProfile);

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
          onClick={() => navigate(`/venues/${selectedVenue?.id}/edit`)}
        >
          Edit Venue
        </Button>
      )}
      <Box>
        <Typography>
          Created:{" "}
          {dayjs.utc(selectedVenue?.created).endOf("day").format("DD/MM/YY")}
        </Typography>
        {selectedVenue?.created !== selectedVenue?.updated && (
          <Typography>
            Updated:{" "}
            {dayjs.utc(selectedVenue?.updated).endOf("day").format("DD/MM/YY")}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default VenueOwnerDetails;