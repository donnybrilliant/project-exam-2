import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useBookingStore, useDialogStore } from "../../stores";
import dayjs from "dayjs";
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
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";

const BookingList = ({ bookings }) => {
  const deleteBooking = useBookingStore((state) => state.deleteBooking);
  const { openDialog } = useDialogStore();
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    bookingId: null,
  });
  const open = Boolean(menuState.anchorEl);

  // Add state to toggle between upcoming and past bookings
  const [showPastBookings, setShowPastBookings] = useState(false);

  const togglePastBookings = () => {
    setShowPastBookings(!showPastBookings);
  };

  const upcomingBookings = bookings
    .filter((booking) => dayjs(booking.dateTo).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom)); // Sort upcoming bookings by soonest first

  const pastBookings = bookings
    .filter((booking) => dayjs(booking.dateTo).isBefore(dayjs()))
    .sort((a, b) => dayjs(b.dateTo) - dayjs(a.dateTo)); // Sort past bookings by most recent first

  // Determine which bookings to display based on `showPastBookings`
  const displayedBookings = showPastBookings ? pastBookings : upcomingBookings;

  console.log(displayedBookings);

  const handleDeleteClickBooking = async (bookingId) => {
    console.log(bookingId);
    const booking = bookings.find((booking) => booking.id === bookingId);
    console.log(booking);
    openDialog(
      `Cancel Booking at ${booking?.venue.name}`,
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      `Dates: ${dayjs(booking?.dateFrom).format("DD/MM/YY")} - ${dayjs(
        booking?.dateTo
      ).format("DD/MM/YY")}. Guests: ${booking?.guests}`,
      async () => {
        await deleteBooking(bookingId, booking.venue.name);
        /*     
        // I dont have access to setBookings here, so I can't update the bookings list
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        ); */
      }
    );
  };

  // This function is used to open the menu for a specific booking
  const handleClick = (event, bookingId) => {
    setMenuState({ anchorEl: event.currentTarget, bookingId });
  };

  // This function is now used to close the menu
  const handleClose = () => {
    setMenuState({ anchorEl: null, bookingId: null });
  };

  const bookingCount = displayedBookings.length;
  const bookingText = bookingCount === 1 ? "Booking" : "Bookings";

  return (
    <>
      <h2>
        You Have {bookingCount} {showPastBookings ? "Past" : "Upcoming"}{" "}
        {bookingText}
      </h2>

      <Button onClick={togglePastBookings}>
        {showPastBookings ? "Show Upcoming Bookings" : "Show Past Bookings"}
      </Button>
      {bookings.length === 0 && (
        <>
          <Typography>You have no upcoming bookings.</Typography>
          <Link to={"/venues"}>
            Click here to browse our venues and book your Holidaze now
          </Link>
          <Typography>Treat yourself!</Typography>
        </>
      )}
      <List>
        {displayedBookings.length > 0 ? (
          displayedBookings.map((booking) => (
            <Fragment key={booking.id}>
              <ListItem
                secondaryAction={
                  <Tooltip title="Open Menu" arrow>
                    <IconButton
                      onClick={(event) => handleClick(event, booking.id)}
                      edge="end"
                      aria-label="booking-menu"
                      aria-controls={open ? "booking-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={booking?.venue.name}
                    src={booking?.venue.media[0]}
                  />
                </ListItemAvatar>
                <ListItemText
                  sx={{
                    textTransform: "capitalize",
                  }}
                  primary={booking?.venue.name}
                  secondary={
                    // add number of nights?
                    dayjs
                      .utc(booking?.dateFrom)
                      .startOf("day")
                      .format("DD/MM/YY") +
                    " - " +
                    dayjs
                      .utc(booking?.dateTo)

                      .endOf("day")
                      .format("DD/MM/YY")
                  }
                />

                {/*                 <ListItemSecondaryAction>
              <Chip
                sx={{ mr: 2 }}
                icon={booking?.guests === 1 ? <Person /> : <People />}
                label={booking?.guests}
              />
              <IconButton
                onClick={() => handleDeleteClickBooking(booking.id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton>
                <EditIcon />
              </IconButton>
              <Button component={Link} to={`/venues/${booking.venue.id}`}>
                View
              </Button>
            </ListItemSecondaryAction> */}
              </ListItem>
              <Divider />
              <Menu
                id="booking-menu"
                anchorEl={menuState.anchorEl}
                open={
                  Boolean(menuState.anchorEl) &&
                  menuState.bookingId === booking.id
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
                <MenuItem component={Link} to={`/venues/${booking.venue.id}`}>
                  <ListItemIcon>
                    <VisibilityIcon fontSize="small" />
                  </ListItemIcon>
                  View Venue
                </MenuItem>
                {!showPastBookings && (
                  <MenuItem>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit
                  </MenuItem>
                )}
                {!showPastBookings && (
                  <MenuItem
                    onClick={() =>
                      handleDeleteClickBooking(menuState.bookingId)
                    }
                  >
                    <ListItemIcon>
                      <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                )}
              </Menu>
            </Fragment>
          ))
        ) : (
          <Typography>
            {showPastBookings ? "No past bookings." : "No upcoming bookings."}
          </Typography>
        )}
      </List>
    </>
  );
};

export default BookingList;
