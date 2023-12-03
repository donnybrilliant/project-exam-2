import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useVenueStore, useSearchStore } from "../../stores";
import Search from "../../components/Search";
import VenueList from "../../components/VenueList";
import Container from "@mui/material/Container";
import dayjs from "dayjs";

// Component for the venues page, listing all venues
const VenuesPage = () => {
  const [searchParams] = useSearchParams();
  const { fetchAllVenues } = useVenueStore();
  const { filterVenues, filteredVenues, updateStoreSearchParams } =
    useSearchStore();

  // Update the searchParams in the URL whenever the store's searchParams changes
  useEffect(() => {
    const fetchDataAndFilter = async () => {
      const params = {
        searchTerm: searchParams.get("searchTerm") || "",
        startDate: searchParams.get("startDate") || null,
        endDate: searchParams.get("endDate") || null,
        guests: searchParams.get("guests") || "1",
      };

      // Parse the dates
      const startDateObj = params.startDate
        ? dayjs(params.startDate, "DD/MM/YY")
        : null;
      const endDateObj = params.endDate
        ? dayjs(params.endDate, "DD/MM/YY")
        : null;

      // Compare the dates and reset endDate to null if startDate is greater
      if (startDateObj && endDateObj && startDateObj.isAfter(endDateObj)) {
        params.endDate = null;
      }

      updateStoreSearchParams(params);

      await fetchAllVenues();

      // Get the search params from the store and filter the venues
      const { searchTerm, startDate, endDate, guests } =
        useSearchStore.getState().searchParams;
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
