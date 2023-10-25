import { NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "../../ui/Logo";
import MenuButton from "./MenuButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// This component is used to display a header with a logo and menu button
const Header = () => {
  return (
    <AppBar position="sticky" color="white" sx={{ marginBottom: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Tooltip title="Go Home" arrow>
          <Box
            component={NavLink}
            to={"/"}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Logo />
            <Typography
              sx={{
                marginLeft: 1,
              }}
            >
              Holidaze
            </Typography>
          </Box>
        </Tooltip>
        <MenuButton />
      </Toolbar>
    </AppBar>
  );
};
export default Header;
