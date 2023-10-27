import { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useProfileStore, useVenueStore } from "../../stores";
import { useDialogStore } from "../../stores"; // Adjust path as necessary
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
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Person from "@mui/icons-material/Person";
import People from "@mui/icons-material/People";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const selectedProfile = useProfileStore((state) => state.selectedProfile);
  const deleteBooking = useVenueStore((state) => state.deleteBooking);
  const { openDialog } = useDialogStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [venues, setVenues] = useState([]);

  // might not need this if i have to fetch the venue bookings.. hmm
  const [ownVenueBookings, setOwnVenueBookings] = useState([]);

  const isBookingAtOwnVenue = (booking) => {
    return venues.some((venue) => venue.id === booking.venue.id);
  };

  const handleDeleteClickBooking = async (bookingId) => {
    const booking = bookings.find((booking) => booking.id === bookingId);
    openDialog(
      `Cancel Booking at ${booking?.venue.name}`,
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      `Dates: ${dayjs(booking?.dateFrom).format("DD/MM/YY")} - ${dayjs(
        booking?.dateTo
      ).format("DD/MM/YY")}. Guests: ${booking?.guests}`,
      async () => {
        await deleteBooking(bookingId, booking?.venue.name);
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );
      }
    );
  };

  useEffect(() => {
    if (selectedProfile) {
      const otherBookings = selectedProfile.bookings.filter(
        (booking) => !isBookingAtOwnVenue(booking)
      );
      const ownBookings = selectedProfile.bookings.filter(isBookingAtOwnVenue);
      setBookings(otherBookings);
      setOwnVenueBookings(ownBookings);
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
        {bookings.map((booking) => (
          <Fragment key={booking.id}>
            <ListItem
              secondaryAction={
                <Tooltip title="Open Menu" arrow>
                  <IconButton
                    onClick={handleClick}
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
              <MenuItem component={Link} to={`/venues/${booking.venue.id}`}>
                <ListItemIcon>
                  <VisibilityIcon fontSize="small" />
                </ListItemIcon>
                View Venue
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDeleteClickBooking(booking.id)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                Delete
              </MenuItem>
            </Menu>
          </Fragment>
        ))}
      </List>
    </>
  );
};

export default BookingList;
