import { DateCalendar } from "@mui/x-date-pickers";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Button,
  Stack,
  Box,
  Skeleton,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";

// This component is used to display a skeleton for a venue page
const VenuePageSkeleton = () => {
  return (
    <Container maxWidth="md">
      <Card>
        <CardMedia>
          <Skeleton variant="rectangular" height={350} />
        </CardMedia>

        <CardContent>
          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 1,
              gap: 1,
            }}
          >
            <Skeleton width={300} height={50} />

            <Rating value={0} disabled style={{ marginLeft: -2 }} />
          </Container>

          <Skeleton width={200} sx={{ marginBottom: 1 }} />

          <Skeleton height={40} width={180} />

          <Typography sx={{ marginBottom: 1 }}>
            <Skeleton />
          </Typography>

          <Skeleton width={120} sx={{ my: 2, float: "right" }} />

          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              marginBottom: 5,
            }}
          >
            <Stack direction="row" spacing={2}>
              <WifiIcon fontSize="large" color="disabled" />

              <LocalParkingIcon fontSize="large" color="disabled" />

              <FreeBreakfastIcon fontSize="large" color="disabled" />

              <PetsIcon fontSize="large" color="disabled" />
            </Stack>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Skeleton width={170} />
            </Typography>
          </Container>
        </CardContent>
        <DateCalendar loading />
        <Container
          sx={{
            width: "320px",
            textAlign: "right",
            marginBottom: 4,
            marginTop: -4,
          }}
        >
          <Skeleton
            width={120}
            height={60}
            sx={{ marginRight: 1, float: "right", marginBottom: 2 }}
          />
        </Container>
        <Button variant="contained" color="primary" fullWidth>
          <Skeleton width={100} />
        </Button>
      </Card>

      <Container
        disableGutters
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBlock: 2,
            cursor: "default",
          }}
        >
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            sx={{ marginRight: 1 }}
          />
          <Skeleton width={100} />
        </Box>

        <Skeleton width={200} />
      </Container>
    </Container>
  );
};

export default VenuePageSkeleton;
