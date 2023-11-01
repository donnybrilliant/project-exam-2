import { useEffect } from "react";
import { useVenueStore, useFetchStore } from "../../stores";
import VenueList from "../../components/VenueList";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import Search from "../../components/Search";

// This component is used to display a home page with a list of venues
const Home = () => {
  // Get states and actions from venuesStore
  const fetchVenues = useVenueStore((state) => state.fetchVenues);
  const fetchAllVenues = useVenueStore((state) => state.fetchAllVenues);
  const isLoading = useFetchStore((state) => state.isLoading);
  const isError = useFetchStore((state) => state.isError);
  const errorMsg = useFetchStore((state) => state.errorMsg);
  const venues = useVenueStore((state) => state.venues);
  const filteredVenues = useVenueStore((state) => state.filteredVenues);

  // Fetch venues when token and fetchVenues function change
  useEffect(() => {
    fetchAllVenues();
  }, []);

  //if (isLoading) return <h1>Loading...</h1>;

  //if (isError) return <h1>Error: {errorMsg}</h1>;

  console.log(filteredVenues);

  return (
    <Container>
      <Search />
      <Typography>Hello</Typography>
    </Container>
  );
};

export default Home;
