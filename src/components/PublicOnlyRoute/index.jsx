import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores";

// This component is used to display a public only route, rerouting to the home page if the user is logged in
const PublicOnlyRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;
