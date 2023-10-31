import { useState, useEffect } from "react"; // Import useState hook
import { useNavigate } from "react-router-dom";
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
  const { searchParams, updateStoreSearchParams } = useVenueStore();
  const [localSearchParams, setLocalSearchParams] = useState(searchParams);
  const navigate = useNavigate();

  // Update localSearchParams whenever searchParams changes
  useEffect(() => {
    setLocalSearchParams(searchParams);
  }, [searchParams]);

  // Handle the search, update the store's searchParams and navigate to the venues page
  const handleSearch = (e) => {
    e.preventDefault();
    updateStoreSearchParams(localSearchParams);
    navigate(
      `/venues?searchTerm=${localSearchParams.searchTerm}&startDate=${localSearchParams.startDate}&endDate=${localSearchParams.endDate}&guests=${localSearchParams.guests}`
    );
  };

  // Update the localSearchParams state whenever a field is changed
  const updateLocalSearchParams = (key, value) => {
    setLocalSearchParams((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Convert the startDate and endDate strings to dayjs objects
  const startDateDate = localSearchParams.startDate
    ? dayjs(localSearchParams.startDate, "DD/MM/YY")
    : null;
  const endDateDate = localSearchParams.endDate
    ? dayjs(localSearchParams.endDate, "DD/MM/YY")
    : null;

  return (
    <Container
      component="form"
      onSubmit={handleSearch}
      disableGutters
      sx={{ marginBottom: 4 }}
    >
      <Grid container rowSpacing={2} sx={{ alignItems: "center" }}>
        <Grid item xs={12} sm={3} md={4}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={localSearchParams.searchTerm}
            onChange={(e) =>
              updateLocalSearchParams("searchTerm", e.target.value)
            }
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="Start Date"
            format="DD/MM/YY"
            disablePast
            value={startDateDate}
            onChange={(date) =>
              updateLocalSearchParams("startDate", date.format("DD/MM/YY"))
            }
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DatePicker
            fullWidth
            sx={{ width: "100%" }}
            label="End Date"
            format="DD/MM/YY"
            disablePast
            minDate={
              localSearchParams.startDate
                ? dayjs(localSearchParams.startDate).add(1, "day")
                : undefined
            }
            value={endDateDate}
            onChange={(date) =>
              updateLocalSearchParams("endDate", date.format("DD/MM/YY"))
            }
          />
        </Grid>
        <Grid item xs={3} sm={2} md={2}>
          <TextField
            fullWidth
            label="Guests"
            variant="outlined"
            type="number"
            inputProps={{ min: "1", max: "100" }}
            value={localSearchParams.guests}
            onChange={(e) => updateLocalSearchParams("guests", e.target.value)}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ height: "54px" }}
          >
            <SearchIcon />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
