import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore, useFetchStore, useProfileStore } from "../../stores";
import { Container, Typography, Button } from "@mui/material";
import BookingList from "../../components/BookingList";
import MyVenueList from "../../components/MyVenueList";
import UserInfo from "../../components/UserInfo";

// Should show total number of bookings for each venue in list and total for user.
// Remember to filter upcoming and past bookings
const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const isLoading = useFetchStore((state) => state.isLoading);
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );
  const selectedProfile = useProfileStore((state) => state.selectedProfile);

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
            to={"/dashboard/venues/create"}
            sx={{ marginBlock: 2 }}
          >
            Register Venue
          </Button>
        ) : (
          <>
            <Typography>Want to list your venue?</Typography>

            <Link>Click here to become a venue manager</Link>
          </>
        )}

        <BookingList bookings={bookings} />
      </Container>
    </>
  );
};

export default Dashboard;
