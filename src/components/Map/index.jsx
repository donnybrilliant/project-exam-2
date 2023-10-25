import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import GoogleMapsLoader from "../../utils/GoogleMapsLoader";

// This component is used to display a map with a single marker
const Map = ({ location }) => {
  const [mapLocation, setMapLocation] = useState(null);

  // When the location changes, geocode the location string
  useEffect(() => {
    const geocoder = new google.maps.Geocoder();

    // Get the location string from the location object
    const getLocationString = (location) => {
      let locationStr = "";
      for (const [key, value] of Object.entries(location)) {
        if (value && key !== "lat" && key !== "lng") {
          locationStr += value + ", ";
        }
      }
      return locationStr.slice(0, -2); // Remove the trailing comma and space
    };

    // Geocode the location string to get the lat and lng
    const geocodeLocation = () => {
      const locationStr = getLocationString(location);
      geocoder.geocode({ address: locationStr }, (results, status) => {
        if (status === "OK") {
          setMapLocation({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          // If geocoding fails, set the map location to null
          setMapLocation(null);
        }
      });
    };

    // If the location is not set, geocode the location string
    if (location.lat === 0 && location.lng === 0) {
      geocodeLocation();
    } else {
      // If the location is set, use the lat and lng directly
      setMapLocation({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  return (
    <>
      {mapLocation && (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={mapLocation}
          zoom={10}
        >
          <Marker position={mapLocation} />
        </GoogleMap>
      )}
    </>
  );
};

export default GoogleMapsLoader(Map);
