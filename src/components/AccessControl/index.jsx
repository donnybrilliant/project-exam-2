import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores";

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
