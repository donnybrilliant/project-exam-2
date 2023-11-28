import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore, useProfileStore } from "../../stores";
import { Container, Typography, Button } from "@mui/material";
import BookingList from "../../components/BookingList";
import UserInfo from "../../components/UserInfo";

// Should show total number of bookings for each venue in list and total for user.
// Remember to filter upcoming and past bookings
const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );
  const selectedProfile = useProfileStore((state) => state.selectedProfile);

  const updateVenueManagerStatus = useProfileStore(
    (state) => state.updateVenueManagerStatus
  );

  const handleBecomeVenueManager = async () => {
    await updateVenueManagerStatus(true);
    // Additional logic if needed, e.g., redirection or success notification
  };

  useEffect(() => {
    fetchProfileByName(userName);
  }, [userName, fetchProfileByName]);

  useEffect(() => {
    if (selectedProfile && selectedProfile.bookings) {
      // Filter out bookings that belong to the owner's venues
      const filteredBookings = selectedProfile.bookings.filter(
        (booking) =>
          !selectedProfile.venues.some((venue) => venue.id === booking.venue.id)
      );
      setBookings(filteredBookings);
    }
  }, [selectedProfile]);

  // if (isLoading) return <Typography>Loading...</Typography>;

  document.title = "Dashboard";

  console.log(selectedProfile);
  return (
    <>
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h1">Dashboard</Typography>
        <UserInfo />
        {selectedProfile?.venueManager ? (
          <Button
            variant="contained"
            component={Link}
            to={"/venuemanager"}
            sx={{ marginBlock: 2 }}
          >
            Go to Venue Manager
          </Button>
        ) : (
          <Container className="marginBlock">
            <Typography variant="h3">Want to list your venue?</Typography>
            <Button as={Link} onClick={handleBecomeVenueManager}>
              Click here to become a venue manager
            </Button>
          </Container>
        )}

        <BookingList bookings={bookings} />
      </Container>
    </>
  );
};

export default Dashboard;
