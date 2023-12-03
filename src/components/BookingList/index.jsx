import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  useBookingStore,
  useDialogStore,
  useFetchStore,
  useProfileStore,
  useVenueStore,
} from "../../stores";
import dayjs from "dayjs";
import BookingForm from "../BookingForm";
import { ListSkeleton } from "../Skeletons";
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
  Container,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatIcon from "@mui/icons-material/Chat";

// Booking list of a user's personal bookings
const BookingList = ({ bookings }) => {
  const deleteBooking = useBookingStore((state) => state.deleteBooking);
  const updateBooking = useBookingStore((state) => state.updateBooking);
  const isLoading = useFetchStore((state) => state.isLoading);
  const removeUserBooking = useProfileStore((state) => state.removeUserBooking);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
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

  // This function is used to open the delete menu for a specific booking
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
        removeUserBooking(bookingId);
      }
    );
  };

  // This function is used to open the edit menu for a specific booking
  const handleEditClickBooking = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const venueData = await fetchVenueById(booking.venue.id);

    openDialog(
      `Edit Booking at ${booking.venue.name}`,
      "Update your booking details.",
      <BookingForm booking={booking} venueData={venueData} />,
      async () => {
        const updatedGuests = useBookingStore.getState().guests;
        const updatedDateRange = useBookingStore.getState().dateRange;

        const updatedBookingData = {
          guests: updatedGuests,
          dateFrom: updatedDateRange[0],
          dateTo: updatedDateRange[1],
        };
        await updateBooking(bookingId, booking.venue.name, updatedBookingData);
        useBookingStore.getState().reset();
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

  if (isLoading) {
    return (
      <Container className="marginBlock">
        <Skeleton width="280px" sx={{ mx: "auto", mb: 1, mt: 5 }} />
        <Skeleton width="200px" sx={{ mx: "auto", mb: 1 }} />

        <List>
          {Array.from(new Array(4)).map((item, index) => (
            <ListSkeleton key={index} />
          ))}
        </List>
      </Container>
    );
  }

  if (bookings.length === 0) {
    return (
      <Container className="marginBlock">
        <Typography variant="h2">You have no upcoming bookings.</Typography>
        <Button component={Link} to={"/venues"}>
          Click here to browse our venues and book your Holidaze now
        </Button>
        <Typography>Treat yourself!</Typography>
      </Container>
    );
  }

  return (
    <Container className="marginBlock">
      <Typography variant="h2">
        You Have {bookingCount} {showPastBookings ? "Past" : "Upcoming"}{" "}
        {bookingText}
      </Typography>

      {pastBookings.length > 0 && (
        <Button onClick={togglePastBookings}>
          {showPastBookings ? "Show Upcoming Bookings" : "Show Past Bookings"}
        </Button>
      )}

      <List>
        {displayedBookings.length > 0 &&
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
                    dayjs(booking?.dateFrom).startOf("day").format("DD/MM/YY") +
                    " - " +
                    dayjs(booking?.dateTo).endOf("day").format("DD/MM/YY")
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
                <MenuItem
                  component={Link}
                  to={`mailto:${booking.venue.owner.email}`}
                >
                  <ListItemIcon>
                    <ChatIcon fontSize="small" />
                  </ListItemIcon>
                  Contact Owner
                </MenuItem>
                {!showPastBookings && <Divider />}
                {!showPastBookings && (
                  <MenuItem
                    onClick={() => handleEditClickBooking(menuState.bookingId)}
                  >
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
          ))}
      </List>
    </Container>
  );
};

export default BookingList;
