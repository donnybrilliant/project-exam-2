import { useEffect } from "react";
import { useVenueStore, useFetchStore } from "../../stores";
import VenueList from "../../components/VenueList";
import Container from "@mui/material/Container";

// This component is used to display a home page with a list of venues
const Home = () => {
  // Get states and actions from venuesStore
  const fetchVenues = useVenueStore((state) => state.fetchVenues);
  const isLoading = useFetchStore((state) => state.isLoading);
  const isError = useFetchStore((state) => state.isError);
  const errorMsg = useFetchStore((state) => state.errorMsg);
  const venues = useVenueStore((state) => state.venues);

  // Fetch venues when token and fetchVenues function change
  useEffect(() => {
    fetchVenues();
  }, []);

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) return <h1>Error: {errorMsg}</h1>;

  console.log(venues);

  return (
    <Container>
      {Array.isArray(venues) && <VenueList venues={venues} />}
    </Container>
  );
};

export default Home;
