import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Logo from "../../ui/Logo";

const Header = () => {
  return (
    <AppBar position="sticky" color="white">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Logo fontSize="large" />
        <Typography sx={{ flexGrow: 1 }}>Holidaze</Typography>
        <Button variant="contained">Login</Button>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
