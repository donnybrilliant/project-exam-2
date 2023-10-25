import { useState } from "react";
import { useAuthStore } from "../../../../stores/index";
import { useNavigate, NavLink } from "react-router-dom";
import ThemeToggle from "../../../ThemeToggle";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";

// This component is used to display a menu button
const MenuButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const token = useAuthStore((state) => state.token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const clearAuthInfo = useAuthStore((state) => state.clearAuthInfo);
  const navigate = useNavigate();

  // This function is used to clear the auth info and navigate to the home page
  const handleLogout = (event) => {
    event.preventDefault();
    clearAuthInfo();
    navigate("/");
  };

  // This function is used to open the menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // This function is used to close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {!token ? (
        <Button component={NavLink} to={"/login"} variant="contained">
          <Login fontSize="small" sx={{ mr: 1 }} />
          Login
        </Button>
      ) : (
        <>
          <Box>
            <Tooltip title="Open Menu" arrow>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar alt={userInfo.name} src={userInfo.avatar} />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  ".MuiMenuItem-root": {
                    px: 3,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 20,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem component={NavLink} to={"/dashboard"}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              Dashboard
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <HolidayVillageIcon fontSize="small" />
              </ListItemIcon>
              My Venues
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <EventNoteIcon fontSize="small" />
              </ListItemIcon>
              My Bookings
            </MenuItem>
            <Divider />
            <ThemeToggle />
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default MenuButton;
