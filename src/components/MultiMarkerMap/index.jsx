import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import GoogleMapsLoader from "../../utils/GoogleMapsLoader";

// This component is used to display a map with multiple markers
const MultiMarkerMap = ({ venues }) => {
  const navigate = useNavigate();

  // Convert the venues object to an array
  const venuesArray = Object.values(venues);

  // Filter out venues with lat and lng equal to 0
  // Filter out venues with invalid lat and lng values
  // Filter out venues with lat and lng in the range of -3 to 3
  const validVenues = venuesArray.filter((venue) => {
    const lat = parseFloat(venue.location.lat);
    const lng = parseFloat(venue.location.lng);
    return (
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      lat !== 0 &&
      lng !== 0 &&
      !(lat >= -3 && lat <= 3 && lng >= -3 && lng <= 3)
    );
  });

  // Create an array of markers
  const markers = useMemo(() => {
    return validVenues.map((venue, index) => (
      <MarkerF
        key={`${venue.name}-${index}`}
        position={{ lat: venue.location.lat, lng: venue.location.lng }}
        label={venue.name || "Venue"}
        onClick={() => handleMarkerClick(venue.id)}
      />
    ));
  }, [validVenues]); // Recalculate markers only if validVenues changes

  // Set the center of the map to Europe
  const center = { lat: 54.773934, lng: 9.3959338 };

  const handleMarkerClick = (venueId) => {
    navigate(`/venues/${venueId}`);
  };

  return (
    validVenues.length > 0 && (
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100dvh" }}
        center={center}
        zoom={3}
      >
        {markers}
      </GoogleMap>
    )
  );
};

export default GoogleMapsLoader(MultiMarkerMap);
