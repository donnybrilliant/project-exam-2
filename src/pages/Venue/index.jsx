import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useVenuesStore } from "../../stores/venuesStore";

// Venue page component
const Venue = () => {
  // Get id from URL
  let { id } = useParams();
  // Get token from authStore
  const { token } = useAuthStore();
  // Get states and actions from venuesStore
  const { selectedVenue, isLoading, isError, fetchVenueById } =
    useVenuesStore();

  // Fetch venue when id, token and fetchVenueById function change
  useEffect(() => {
    fetchVenueById(id, token);
  }, [id, token, fetchVenueById]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    <div>
      {selectedVenue && (
        <div>
          <h1>{selectedVenue.name}</h1>
        </div>
      )}
    </div>
  );
};

export default Venue;
