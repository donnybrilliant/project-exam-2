import {
  useBookingStore,
  useDialogStore,
  useFetchStore,
  useVenueStore,
  useAuthStore,
} from "../../stores";
import dayjs from "dayjs";
import BookingForm from "../BookingForm";
import { DataGrid } from "@mui/x-data-grid";
import {
  Avatar,
  Container,
  IconButton,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";

// This component is used to display the bookings grid with all the bookings for the venues of the current user
const BookingGrid = ({ venueBookings }) => {
  const isLoading = useFetchStore((state) => state.isLoading);
  const deleteBooking = useBookingStore((state) => state.deleteBooking);
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const { openDialog } = useDialogStore();
  const updateBooking = useBookingStore((state) => state.updateBooking);
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;

  const handleDelete = async (booking) => {
    // Call the deleteBooking action from your store
    openDialog(
      `Cancel Booking at ${booking?.venue.name}`,
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      `Dates: ${dayjs(booking?.dateFrom).format("DD/MM/YY")} - ${dayjs(
        booking?.dateTo
      ).format("DD/MM/YY")}. Guests: ${booking?.guests}`,
      async () => {
        await deleteBooking(booking.id, booking.venue.name);
      }
    );
  };

  // This function is called when the user clicks on the edit button
  const handleEdit = async (bookingId) => {
    const booking = venueBookings.find((b) => b.id === bookingId);
    const venueData = await fetchVenueById(booking.venue.id);

    // Call the openDialog action from your store
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

  // Define the columns for the DataGrid
  const columns = [
    {
      field: "dateFrom",
      headerName: "Date From",
      width: 100,
      valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YY"),
    },
    {
      field: "dateTo",
      headerName: "Date To",
      width: 100,
      valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YY"),
    },
    { field: "nights", headerName: "Nights", type: "number", width: 60 },
    { field: "guests", headerName: "Guests", type: "number", width: 60 },
    {
      field: "venueName",
      headerName: "Venue",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => params.row.venue.name,
      renderCell: (params) => (
        <>
          <Avatar alt={params.row.venue.name} src={params.row.venue.media[0]} />
          <Link
            href={`/venues/${params.row.venue.id}`}
            style={{ marginLeft: 8 }}
          >
            {params.row.venue.name || "No venue name - please update"}
          </Link>
        </>
      ),
    },
    {
      field: "customerName",
      headerName: "Customer",
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.row.customer.name,
      renderCell: (params) => (
        <>
          <Avatar
            alt={params.row.customer.name}
            src={params.row.customer.avatar}
          />
          <span style={{ marginLeft: 8 }}>{params.row.customer.name}</span>
        </>
      ),
    },
    {
      field: "created",
      headerName: "Created",
      width: 100,
      valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YY"),
    },

    {
      field: "actions",
      headerName: "Actions",
      filterable: false,
      sortable: false,
      width: 130,
      align: "right",
      renderCell: (params) => {
        return (
          <>
            {params.row.customer.name === userName && (
              <>
                <Tooltip title="Edit Booking">
                  <IconButton
                    onClick={() => {
                      handleEdit(params.row.id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel Booking">
                  <IconButton onClick={() => handleDelete(params.row)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title="Contact Customer">
              <IconButton
                component={Link}
                href={`mailto:${params.row.customer.email}`}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <ChatIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  // Map venueBookings to format suitable for DataGrid
  const rows = venueBookings.map((booking) => ({
    id: booking.id,
    dateFrom: dayjs(booking.dateFrom),
    dateTo: dayjs(booking.dateTo),
    nights: dayjs(booking.dateTo).diff(dayjs(booking.dateFrom), "day"),
    guests: booking.guests,
    venue: booking.venue,
    customer: booking.customer,
    created: dayjs(booking.created),
  }));
  /*  const greenRowStyle = { backgroundColor: "lightgreen" }; */
  return (
    <>
      {venueBookings.length === 0 ? (
        <Container sx={{ my: 1 }}>
          <Typography variant="h3">
            Your venues have no bookings yet.
          </Typography>
        </Container>
      ) : (
        <Container sx={{ my: 1 }}>
          <Typography variant="h2">Upcoming Stays at My Venues</Typography>
        </Container>
      )}

      <div style={{ height: 370, width: "100%" }}>
        <DataGrid
          loading={isLoading}
          rows={rows}
          columns={columns}
          initialState={{
            sorting: {
              sortModel: [{ field: "dateFrom", sort: "asc" }],
            },
          }}
          hideFooterSelectedRowCount

          /*  getRowClassName={(params) =>
          isBookingNow(params.row) ? "greenRow" : ""
        }
    
        sx={{
          "& .greenRow": greenRowStyle,
        }} */
        />
      </div>
    </>
  );
};

export default BookingGrid;
