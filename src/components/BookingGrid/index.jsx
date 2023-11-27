import { useBookingStore } from "../../stores";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, IconButton } from "@mui/material";
import { Link as MuiLink } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";

// Remove edit and delete from datagrid if not owner?
// Make another datagrid for owner with edit and delete?
const BookingGrid = ({ venueBookings }) => {
  console.log(venueBookings);

  const deleteBooking = useBookingStore((state) => state.deleteBooking);

  const handleDelete = async (id, name) => {
    // Call the deleteBooking action from your store
    await deleteBooking(id, name);
    // You might want to refresh your data here to reflect the deletion
  };

  // Check if the booking is happening now
  /*   const isBookingNow = (booking) => {
    const now = dayjs();
    return (
      now.isAfter(dayjs(booking.dateFrom)) &&
      now.isBefore(dayjs(booking.dateTo))
    );
  }; */
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
          <Link to={`/venues/${params.row.venue.id}`} style={{ marginLeft: 8 }}>
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
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                /* handleEdit(params.row.id) */
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row.id, params.row.venue.name)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              component={MuiLink}
              href={`mailto:${params.row.customer.email}`}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <ChatIcon />
            </IconButton>
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
    <div style={{ height: 370, width: "100%" }}>
      <DataGrid
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
  );
};

export default BookingGrid;
