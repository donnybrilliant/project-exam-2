import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useAuthStore,
  useFetchStore,
  useProfileStore,
  useVenueStore,
} from "../../stores";
import BookingList from "../../components/BookingList";
import UserInfo from "../../components/UserInfo";
import FavoritesList from "../../components/FavoritesList";
import { Container, Typography, Button, Skeleton } from "@mui/material";

// Should show total number of bookings for each venue in list and total for user.
// Remember to filter upcoming and past bookings
const Dashboard = () => {
  const isLoading = useFetchStore((state) => state.isLoading);
  const [bookings, setBookings] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const updateVenueManagerStatus = useProfileStore(
    (state) => state.updateVenueManagerStatus
  );
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);

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
      setBookingList(filteredBookings);
    }
  }, [selectedProfile]);

  // Fetch detailed booking information for each filtered booking
  useEffect(() => {
    const fetchVenuesAndEnrichBookings = async () => {
      // Extract unique venue IDs from the bookingList
      const venueIds = Array.from(
        new Set(bookingList.map((booking) => booking.venue.id))
      );

      // Fetch venue details for each unique venue ID
      const venuesPromises = venueIds.map((id) => fetchVenueById(id));
      const venues = await Promise.all(venuesPromises);

      // Create a map of venueId to venue for quick lookup
      const venueMap = venues.reduce((acc, venue) => {
        acc[venue.id] = venue;
        return acc;
      }, {});

      // Enrich bookings with venue owner details
      const enrichedBookings = bookingList.map((booking) => {
        const venueWithOwner = venueMap[booking.venue.id];
        return {
          ...booking,
          venue: {
            ...booking.venue,
            owner: venueWithOwner.owner, // Assuming owner details are in the fetched venue object
          },
        };
      });

      setBookings(enrichedBookings);
    };

    if (bookingList.length > 0) {
      fetchVenuesAndEnrichBookings();
    }
  }, [bookingList, fetchVenueById]);

  document.title = "Dashboard";

  return (
    <>
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h1">Dashboard</Typography>
        <UserInfo userInfo={userInfo} />

        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="200px"
            height="36px"
            sx={{ mx: "auto", my: 4, borderRadius: 1 }}
          />
        ) : (
          <>
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
                <Button component={Link} onClick={handleBecomeVenueManager}>
                  Click here to become a venue manager
                </Button>
              </Container>
            )}
          </>
        )}
        <BookingList bookings={bookings} />
        <FavoritesList />
      </Container>
    </>
  );
};

export default Dashboard;
