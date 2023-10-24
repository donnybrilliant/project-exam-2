import { useState } from "react";
import { useVenueStore } from "../../stores";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Person from "@mui/icons-material/Person";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const filterVenues = useVenueStore((state) => state.filterVenues);

  const handleFilter = () => {
    filterVenues(searchTerm, startDate, endDate, guests);
  };

  return (
    <Grid
      container
      rowSpacing={2}
      sx={{
        marginBottom: 3,
      }}
    >
      <Grid item>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleFilter();
          }}
        />
      </Grid>
      <Grid item>
        <DatePicker
          label="Start Date"
          value={startDate}
          format="DD/MM/YY"
          disablePast
          onChange={(date) => {
            setStartDate(date);
            handleFilter();
          }}
          sx={{
            width: "145px",
          }}
        />
      </Grid>
      <Grid item>
        <DatePicker
          label="End Date"
          value={endDate}
          format="DD/MM/YY"
          disablePast
          minDate={startDate ? dayjs(startDate).add(1, "day") : undefined}
          onChange={(date) => {
            setEndDate(date);
            handleFilter();
          }}
          sx={{
            width: "145px",
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          sx={{
            width: "90px",
          }}
          label="Guests"
          variant="outlined"
          type="number"
          inputProps={{ min: "1", max: "100" }}
          value={guests}
          onChange={(e) => {
            setGuests(e.target.value);
            handleFilter();
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item>
        <Button sx={{ height: "100%", width: "100%" }} variant="contained">
          Search
        </Button>
      </Grid>
    </Grid>
  );
};

export default Search;
