import { useEffect } from "react";
import useAuthStore from "../../stores/authStore";
import useVenuesStore from "../../stores/venuesStore";
import VenueList from "../../components/VenueList";
import Container from "@mui/material/Container";

// Home page component
const Home = () => {
  // Get token from authStore
  const { token } = useAuthStore();
  // Get states and actions from venuesStore
  const { venues, isLoading, isError, fetchVenues } = useVenuesStore();

  // Fetch venues when token and fetchVenues function change
  useEffect(() => {
    fetchVenues(token);
  }, [token, fetchVenues]);

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error</h1>;

  console.log(venues);

  return (
    <Container>
      {Array.isArray(venues) && <VenueList venues={venues} />}
    </Container>
  );
};

export default Home;
