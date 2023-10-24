import { useState } from "react";
import { useVenueStore } from "../../stores";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const filterVenues = useVenueStore((state) => state.filterVenues);

  const handleFilter = () => {
    filterVenues(searchTerm, startDate, endDate);
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: 3,
      }}
      disableGutters
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleFilter();
          }}
        />
        <DatePicker
          label="Start Date"
          value={startDate}
          format="DD-MM-YYYY"
          disablePast
          onChange={(date) => {
            setStartDate(date);
            handleFilter();
            if (date) {
              setEndDate(dayjs(date).add(1, "day"));
            }
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          format="DD-MM-YYYY"
          disablePast
          minDate={startDate ? dayjs(startDate).add(1, "day") : undefined}
          open={startDate !== null}
          onChange={(date) => {
            setEndDate(date);
            handleFilter();
          }}
        />
      </LocalizationProvider>
    </Container>
  );
};

export default Search;
