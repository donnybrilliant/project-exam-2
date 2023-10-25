import { useState } from "react";
import { useVenueStore } from "../../stores";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Person from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

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
    <Container disableGutters sx={{ marginBottom: 4 }}>
      <Grid container rowSpacing={2} sx={{ alignItems: "center" }}>
        <Grid item xs={12} sm={3} md={4}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilter();
            }}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="Start Date"
            value={startDate}
            format="DD/MM/YY"
            disablePast
            onChange={(date) => {
              setStartDate(date);
              handleFilter();
            }}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="End Date"
            value={endDate}
            format="DD/MM/YY"
            disablePast
            minDate={startDate ? dayjs(startDate).add(1, "day") : undefined}
            onChange={(date) => {
              setEndDate(date);
              handleFilter();
            }}
          />
        </Grid>
        <Grid item xs={3} sm={2} md={2}>
          <TextField
            fullWidth
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
        <Grid item xs={9} sm={1} md={2}>
          <Button fullWidth variant="contained" sx={{ height: "54px" }}>
            <SearchIcon />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
