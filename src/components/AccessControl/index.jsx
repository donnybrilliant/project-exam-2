import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const isOwner = useVenueStore((state) => state.isOwner());
  const { pathname } = useLocation(); // Get the current path

  useEffect(() => {
    if (!isOwner) {
      const venueId = pathname.split("/")[2]; // Assuming the path is /venues/:id/edit
      navigate(`/venues/${venueId}`); // Redirect to the venue page if not the owner
    }
  }, [isOwner, navigate, pathname]);

  return isOwner ? children : null;
};
