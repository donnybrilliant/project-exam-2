import { NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./Logo";
import MenuButton from "./MenuButton";
import { Box, Typography, Tooltip } from "@mui/material";

// This component is used to display a header with a logo and menu button
const Header = () => {
  return (
    <AppBar position="sticky" color="background" sx={{ marginBottom: 4 }}>
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
            reloadDocument
          >
            <Logo />
            <Typography
              variant="logo"
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
