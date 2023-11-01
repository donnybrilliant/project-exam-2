import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, useVenueStore } from "../../stores";

// This component is used to display a public only route, rerouting to the home page if the user is logged in
export const PublicOnlyRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/" replace /> : children;
};

// This component is used to display a private only route, rerouting to the login page if the user is not logged in
export const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  return !token ? (
    <Navigate to="/login" replace state={{ from: location }} />
  ) : (
    children
  );
};

// This component is used to display a owner only route, rerouting to the home page if the user is not an owner
export const OwnerRoute = ({ children }) => {
  const isOwner = useVenueStore((state) => state.isOwner());
  const location = useLocation();
  const venueId = location.pathname.split("/")[2]; // Extracts the id from the path assuming the path is "/venues/:id/edit"
  const redirectTo = `/venues/${venueId}`; // Constructs the redirect path

  return !isOwner ? (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  ) : (
    children
  );
};
