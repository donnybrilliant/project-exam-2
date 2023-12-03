import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useProfileStore, useAuthStore } from "../../stores";
import MyVenueList from "../../components/MyVenueList";
import BookingGrid from "../../components/BookingGrid";
import { Button, Container, Typography } from "@mui/material";

// This component is used to display the venue manager page
const VenueManager = () => {
  const fetchUserVenues = useProfileStore((state) => state.fetchUserVenues);
  const updateVenueBookings = useProfileStore(
    (state) => state.updateVenueBookings
  );
  const userVenues = useProfileStore((state) => state.userVenues);
  const venueBookings = useProfileStore((state) => state.venueBookings);
  const userName = useAuthStore((state) => state.userInfo.name);

  // Fetch user venues when userName changes
  useEffect(() => {
    fetchUserVenues(userName);
  }, [fetchUserVenues, userName]);

  // Update venue bookings when userVenues changes
  useEffect(() => {
    if (userVenues.length > 0) {
      updateVenueBookings();
    }
  }, [userVenues, updateVenueBookings]);

  return (
    <>
      <Container sx={{ textAlign: "center" }}>
        <Helmet>
          <title>Venue Manager - Holidaze</title>
          <meta
            name="description"
            content="Manage your Holidaze venues with ease!"
          />
        </Helmet>
        <Typography variant="h1">Venue Manager</Typography>

        <Button
          variant="contained"
          component={Link}
          to={"/venuemanager/register"}
          sx={{ marginBlock: 5 }}
        >
          Register New Venue
        </Button>

        {userVenues.length > 0 && <BookingGrid venueBookings={venueBookings} />}
        <MyVenueList venues={userVenues} />
      </Container>
    </>
  );
};

export default VenueManager;
