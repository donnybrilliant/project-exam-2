import { LoadScript } from "@react-google-maps/api";
import { apiKey } from "../config";

const GoogleMapsLoader = ({ children }) => {
  return apiKey ? (
    <LoadScript googleMapsApiKey={apiKey}>{children}</LoadScript>
  ) : (
    <>{children}</>
  );
};

export default GoogleMapsLoader;
