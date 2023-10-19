import { useEffect } from "react";
import { Link } from "react-router-dom";
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

  return (
    <Container>
      <VenueList venues={venues} />
    </Container>
    /*     <ul>
      {Array.isArray(venues) &&
        venues.map((venue) => (
          <li key={venue.id}>
            <Link to={`/venues/${venue.id}`}>
              {venue.name} {venue.rating}
            </Link>
          </li>
        ))}
    </ul> */
  );
};

export default Home;
