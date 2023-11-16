import { useState, useEffect } from "react"; // Import useState hook
import { useNavigate } from "react-router-dom";
import { useVenueStore, useFetchStore } from "../../stores";
import dayjs from "dayjs";
import AutocompleteSearch from "../AutocompleteSearch";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Person from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import LoadingButton from "@mui/lab/LoadingButton";

// Search bar component
const Search = () => {
  const { searchParams, updateStoreSearchParams } = useVenueStore();
  const [localSearchParams, setLocalSearchParams] = useState(searchParams);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const isLoading = useFetchStore((state) => state.isLoading);

  const navigate = useNavigate();

  // Update localSearchParams whenever searchParams changes
  useEffect(() => {
    setLocalSearchParams(searchParams);
    // console.log(localSearchParams);
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
  const startDateValue = localSearchParams.startDate
    ? dayjs(localSearchParams.startDate, "DD/MM/YY")
    : null;
  const endDateValue = localSearchParams.endDate
    ? dayjs(localSearchParams.endDate, "DD/MM/YY")
    : null;

  const handleStartDateChange = (newValue) => {
    // Format and update the start date
    const formattedDate = dayjs(newValue).format("DD/MM/YY");
    updateLocalSearchParams("startDate", formattedDate);
    // Open the end date picker
    setEndDatePickerOpen(true);
  };

  const handleEndDateChange = (newValue) => {
    // Format and update the end date
    const formattedDate = dayjs(newValue).format("DD/MM/YY");
    updateLocalSearchParams("endDate", formattedDate);
    // You might want to close the end date picker here
    setEndDatePickerOpen(false);
  };

  return (
    <Container
      component="form"
      onSubmit={handleSearch}
      disableGutters
      sx={{ marginBottom: 4 }}
    >
      <Grid container rowSpacing={2} sx={{ alignItems: "center" }}>
        <Grid item xs={12} sm={3} md={4}>
          <AutocompleteSearch
            localSearchParams={localSearchParams}
            updateLocalSearchParams={updateLocalSearchParams}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DatePicker
            id="start-date"
            name="startDate"
            fullWidth
            sx={{ width: "100%" }}
            label="Start Date"
            format="DD/MM/YY"
            disablePast
            maxDate={
              endDateValue ? dayjs(endDateValue).subtract(1, "day") : null
            }
            value={startDateValue}
            onChange={handleStartDateChange}
            onAccept={handleStartDateChange} // Call the same function on accept
          />
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <DatePicker
            id="end-date"
            name="endDate"
            fullWidth
            sx={{ width: "100%" }}
            label="End Date"
            format="DD/MM/YY"
            disablePast
            minDate={
              startDateValue ? dayjs(startDateValue).add(1, "day") : undefined
            }
            value={endDateValue}
            open={endDatePickerOpen} // Controlled by state
            onOpen={() => setEndDatePickerOpen(true)} // Optional: Explicitly set open state
            onClose={() => setEndDatePickerOpen(false)} // Close picker when focus is lost
            onChange={handleEndDateChange}
          />
        </Grid>
        <Grid item xs={3} sm={2} md={2}>
          <TextField
            id="guests"
            name="guests"
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
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={isLoading}
            sx={{ height: "54px" }}
          >
            <SearchIcon />
          </LoadingButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search;
