import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Logo from "../../ui/Logo";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="sticky" color="white" sx={{ marginBottom: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Logo fontSize="large" />
        <Typography component={NavLink} to={"/"} sx={{ flexGrow: 1 }}>
          Holidaze
        </Typography>
        <Button component={NavLink} to={"/login"} variant="contained">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
