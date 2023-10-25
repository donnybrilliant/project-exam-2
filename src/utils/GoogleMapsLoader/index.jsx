import { LoadScript } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GoogleMapsLoader = (MapComponent) => {
  return (props) => {
    if (!apiKey) return;

    return (
      <LoadScript googleMapsApiKey={apiKey}>
        <MapComponent {...props} />
      </LoadScript>
    );
  };
};

export default GoogleMapsLoader;
