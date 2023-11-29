import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useProfileStore, useVenueStore } from "../../stores";
import { useDialogStore } from "../../stores"; // Adjust path as necessary

import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventBusyIcon from "@mui/icons-material/EventBusy";

const MyVenueList = ({ venues }) => {
  // Should be taken from userInfo in authstore..

  const deleteVenue = useVenueStore((state) => state.deleteVenue);

  const { openDialog } = useDialogStore();
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    venueId: null,
  });
  const open = Boolean(menuState.anchorEl);

  const handleDeleteClickVenue = (venueId) => {
    const venue = venues.find((venue) => venue.id === venueId);

    openDialog(
      `Delete Venue: ${venue?.name}`,
      "Are you sure you want to delete this venue? This action cannot be undone.",
      `You have ${
        venue?.bookings?.length ? venue.bookings.length : "0"
      } upcoming bookings for this venue.`,
      async () => {
        await deleteVenue(venueId, venue.name);
        /*   setVenues((prevVenues) =>
          prevVenues.filter((venue) => venue.id !== venueId)
        ); */
      }
    );
  };

  // This function is used to open the menu for a specific booking
  const handleClick = (event, venueId) => {
    setMenuState({ anchorEl: event.currentTarget, venueId });
  };

  // This function is now used to close the menu
  const handleClose = () => {
    setMenuState({ anchorEl: null, venueId: null });
  };

  return (
    <>
      {venues.length === 0 ? (
        <div className="marginBlock">
          <Typography variant="h2" sx={{ marginBottom: 1 }}>
            You have no venues yet.
          </Typography>
          <Button component={Link} to={"/dashboard/venues/create"}>
            Click here to create one
          </Button>
        </div>
      ) : (
        <>
          <Typography variant="h3" sx={{ marginTop: 6 }}>
            My Venues
          </Typography>
          <List>
            {venues.map((venue) => (
              <Fragment key={venue.id}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="Open Menu" arrow>
                      <IconButton
                        onClick={(event) => handleClick(event, venue.id)}
                        edge="end"
                        aria-label="venue-menu"
                        aria-controls={open ? "venue-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt={venue?.name} src={venue?.media[0]} />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      textTransform: "capitalize",
                    }}
                    primary={venue?.name || "No venue name - please update"}
                    secondary={
                      "Bookings: " +
                      venue?.bookings.length +
                      " Rating: " +
                      venue?.rating +
                      " Price: $" +
                      venue?.price
                    }
                  />
                </ListItem>
                <Divider />
                <Menu
                  id="venue-menu"
                  anchorEl={menuState.anchorEl}
                  open={
                    Boolean(menuState.anchorEl) &&
                    menuState.venueId === venue.id
                  }
                  onClose={handleClose}
                  onClick={handleClose}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      minWidth: "200px",
                    },
                  }}
                >
                  <MenuItem component={Link} to={`/venues/${venue.id}`}>
                    <ListItemIcon>
                      <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    View
                  </MenuItem>
                  <MenuItem component={Link} to={`/venues/${venue.id}/edit`}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteClickVenue(venue.id)}>
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <EventBusyIcon fontSize="small" />
                    </ListItemIcon>
                    Occupy dates
                  </MenuItem>
                </Menu>
              </Fragment>
            ))}
          </List>
        </>
      )}
    </>
  );
};

export default MyVenueList;
