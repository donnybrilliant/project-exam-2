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

// This component is used to display the dashboard page
const Dashboard = () => {
  const isLoading = useFetchStore((state) => state.isLoading);
  const [bookings, setBookings] = useState([]);
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const userBookings = useProfileStore((state) => state.userBookings);
  const fetchUserBookings = useProfileStore((state) => state.fetchUserBookings);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const updateVenueManagerStatus = useProfileStore(
    (state) => state.updateVenueManagerStatus
  );

  // Handler for becoming a venue manager
  const handleBecomeVenueManager = async () => {
    await updateVenueManagerStatus(true);
  };

  // Fetch user bookings when userName changes
  useEffect(() => {
    fetchUserBookings(userName);
  }, [userName, fetchUserBookings]);

  // Enrich bookings with venue details when userBookings changes
  useEffect(() => {
    const fetchVenuesAndEnrichBookings = async () => {
      // Extract unique venue IDs from the userBookings
      const venueIds = Array.from(
        new Set(userBookings.map((booking) => booking.venue.id))
      );

      // Fetch venue details for each unique venue ID
      const venuesPromises = venueIds.map((id) => fetchVenueById(id));
      const venues = await Promise.all(venuesPromises);

      // Create a map of venueId to venue for quick lookup
      const venueMap = venues.reduce((acc, venue) => {
        acc[venue.id] = venue;
        return acc;
      }, {});

      // Filter out bookings for venues where the user is the owner
      const filteredBookings = userBookings.filter(
        (booking) => venueMap[booking.venue.id].owner.name !== userName
      );

      // Enrich bookings with venue details
      const enrichedBookings = filteredBookings.map((booking) => {
        return {
          ...booking,
          venue: venueMap[booking.venue.id],
        };
      });

      setBookings(enrichedBookings);
    };

    if (userBookings.length > 0) {
      fetchVenuesAndEnrichBookings();
    }
  }, [userBookings, fetchVenueById, userName]);

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
            {userInfo?.venueManager ? (
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
