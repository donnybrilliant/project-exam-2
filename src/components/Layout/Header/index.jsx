import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Logo from "../../ui/Logo";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../stores/index";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

// This component is used to display a header with a logo and a login button
const Header = () => {
  const token = useAuthStore((state) => state.token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearAuthInfo = useAuthStore((state) => state.clearAuthInfo);
  const navigate = useNavigate();

  // This function is used to clear the auth info and navigate to the home page
  const handleLogout = (event) => {
    event.preventDefault();
    clearAuthInfo();
    // or navigate elsewhere?
    navigate("/");
  };

  return (
    <AppBar position="sticky" color="white" sx={{ marginBottom: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Logo fontSize="large" />
        <Typography sx={{ flexGrow: 1 }}>
          <NavLink to={"/"}>Holidaze</NavLink>
        </Typography>
        {!token ? (
          <Button component={NavLink} to={"/login"} variant="contained">
            Login
          </Button>
        ) : (
          <>
            <Typography>{userInfo.name}</Typography>
            <Avatar
              component={NavLink}
              to={"/dashboard"}
              alt={userInfo.name}
              src={userInfo.avatar}
            />
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default Header;
