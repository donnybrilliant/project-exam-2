import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useVenueStore, useFetchStore } from "../../stores";
import Search from "../../components/Search";
import VenueList from "../../components/VenueList";
import Container from "@mui/material/Container";

// In your VenuesPage component
const VenuesPage = () => {
  const isLoading = useFetchStore((state) => state.isLoading);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    fetchAllVenues,
    filterVenues,
    filteredVenues,
    updateStoreSearchParams,
  } = useVenueStore();

  // Update the searchParams in the URL whenever the store's searchParams changes
  useEffect(() => {
    const fetchDataAndFilter = async () => {
      await fetchAllVenues();
      const params = {
        searchTerm: searchParams.get("searchTerm") || "",
        startDate: searchParams.get("startDate") || null,
        endDate: searchParams.get("endDate") || null,
        guests: searchParams.get("guests") || "1",
      };
      updateStoreSearchParams(params);

      // Get the search params from the store and filter the venues
      const { searchTerm, startDate, endDate, guests } =
        useVenueStore.getState().searchParams;
      filterVenues(searchTerm, startDate, endDate, guests);
    };

    // Call the function to fetch the venues and filter them
    fetchDataAndFilter();
  }, [fetchAllVenues, filterVenues, searchParams, updateStoreSearchParams]);

  //if (isLoading) return <p>Loading...</p>;

  document.title = "Venues - Holidaze";

  return (
    <Container>
      <Search />
      {Array.isArray(filteredVenues) && <VenueList venues={filteredVenues} />}
    </Container>
  );
};

export default VenuesPage;
