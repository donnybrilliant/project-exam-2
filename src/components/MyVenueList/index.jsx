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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventBusyIcon from "@mui/icons-material/EventBusy";

const MyVenueList = () => {
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const [venues, setVenues] = useState([]);
  const deleteVenue = useVenueStore((state) => state.deleteVenue);

  const { openDialog } = useDialogStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleDeleteClickVenue = (venueId) => {
    const venue = selectedProfile?.venues.find((venue) => venue.id === venueId);
    // TODO: I need to fetch venue to get bookings..
    openDialog(
      `Delete Venue: ${venue?.name}`,
      "Are you sure you want to delete this venue? This action cannot be undone.",
      `You have ${
        venue?.bookings?.length ? venue.bookings.length : "0"
      } upcoming bookings for this venue.`,
      async () => {
        await deleteVenue(venueId, venue?.name);
        setVenues((prevVenues) =>
          prevVenues.filter((venue) => venue.id !== venueId)
        );
      }
    );
  };

  useEffect(() => {
    if (selectedProfile) {
      setVenues(selectedProfile.venues);
    }
  }, [selectedProfile]);

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
      {venues.length === 0 && (
        <>
          <Typography>You have no venues yet.</Typography>
          <Link to={"/dashboard/venues/create"}>Click here to create one</Link>
        </>
      )}

      <List>
        {venues.map((venue) => (
          <Fragment key={venue.id}>
            <ListItem
              secondaryAction={
                <Tooltip title="Open Menu" arrow>
                  <IconButton
                    onClick={handleClick}
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
                  "Rating: " + venue?.rating + " Price: " + venue?.price
                }
              />
            </ListItem>
            <Divider />
            <Menu
              id="venue-menu"
              anchorEl={anchorEl}
              open={open}
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
  );
};

export default MyVenueList;
