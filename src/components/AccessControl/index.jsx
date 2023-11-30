import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore, useVenueStore } from "../../stores";

// This component is used to display a public only route, rerouting to the home page if the user is logged in
export const PublicOnlyRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();

  if (token) {
    // If 'from' is not available in the location state, navigate to the default route like dashboard
    // If coming from the index route, redirect to the dashboard
    const fromPath = location.state?.from?.pathname;
    const redirectTo =
      fromPath === "/" ? "/dashboard" : fromPath || "/dashboard";
    navigate(redirectTo, { replace: true });
    return null;
  }

  return children;
};

// This component is used to display a private only route, rerouting to the login page if the user is not logged in
export const PrivateRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  return token ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// This component is used to display a owner only route, rerouting to the home page if the user is not an owner
export const OwnerRoute = ({ children }) => {
  const isOwner = useVenueStore((state) => state.isOwner());
  const location = useLocation();
  const venueId = location.pathname.split("/")[2]; // Extracts the id from the path assuming the path is "/venues/:id/edit"
  const redirectTo = `/venues/${venueId}`; // Constructs the redirect path

  return !isOwner ? (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  ) : (
    children
  );
};
