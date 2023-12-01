import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {
  useProfileStore,
  useAuthStore,
  useBookingStore,
  useFetchStore,
} from "../../stores";
import { useEffect, useState } from "react";
import MyVenueList from "../../components/MyVenueList";
import BookingGrid from "../../components/BookingGrid";

const VenueManager = () => {
  const isLoading = useFetchStore((state) => state.isLoading);
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const fetchUserVenues = useProfileStore((state) => state.fetchUserVenues);
  const userVenues = useProfileStore((state) => state.userVenues);
  const [venueBookings, setVenueBookings] = useState([]);
  const getBooking = useBookingStore((state) => state.getBooking);

  document.title = "Venue Manager";

  useEffect(() => {
    fetchUserVenues(userName);
  }, [fetchUserVenues, userName]);

  useEffect(() => {
    const fetchBookings = async () => {
      // This will be an array of all bookings' promises we need to fetch
      const bookingsPromises = userVenues.flatMap((venue) =>
        venue.bookings.map((booking) => getBooking(booking.id))
      );

      // Resolve all promises to get the booking details
      const bookingsDetails = await Promise.all(bookingsPromises);

      // Set the state with all fetched bookings
      setVenueBookings(bookingsDetails);
    };

    if (userVenues.length > 0) {
      fetchBookings();
    }
  }, [userVenues, getBooking]);

  //console.log(userVenues);
  //console.log(venueBookings);

  return (
    <>
      <Container sx={{ textAlign: "center" }}>
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