import { useState, useEffect } from "react";
import { MenuItem, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useVenueStore } from "../../stores";
import {
  Checkbox,
  Stack,
  Container,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";

const SortAndFilter = () => {
  const currentSortType = useVenueStore.getState().sortType;
  const updateSortType = useVenueStore((state) => state.updateSortType);
  const filterVenues = useVenueStore((state) => state.filterVenues);
  const reverseFilteredVenues = useVenueStore(
    (state) => state.reverseFilteredVenues
  );
  const searchParams = useVenueStore.getState().searchParams;
  const isReversed = useVenueStore((state) => state.isReversed);
  const [amenityFilters, setAmenityFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });
  useEffect(() => {
    // Call filterVenues with the updated filters and sort type
    filterVenues(
      searchParams.searchTerm,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.guests,
      currentSortType || "default",
      amenityFilters
    );
  }, [amenityFilters, currentSortType]);

  // handleFilterChange now only updates state and relies on useEffect to call filterVenues
  const handleFilterChange = (type, value) => {
    if (type === "sort") {
      updateSortType(value);
    } else {
      setAmenityFilters((prevFilters) => ({
        ...prevFilters,
        [type]: value,
      }));
    }
  };

  const handleAmenityChange = (event) => {
    handleFilterChange(event.target.name, event.target.checked);
  };

  const handleToggleSortOrder = () => {
    reverseFilteredVenues();
  };

  const handleSortChange = (event) => {
    const newSortType = event.target.value;
    handleFilterChange("sort", newSortType);
  };

  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <IconButton onClick={handleToggleSortOrder}>
        {isReversed ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </IconButton>

      <FormControl sx={{ minWidth: "100px" }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          value={currentSortType || ""}
          label="Sort by"
          onChange={handleSortChange} // Add onChange handler
          variant="standard"
        >
          <MenuItem value="alphabetical">Alphabetical</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="created">Created</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="popularity">Popularity</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row">
        <Checkbox
          icon={<WifiIcon />}
          checkedIcon={<WifiIcon color="info" />}
          checked={amenityFilters.wifi}
          onChange={handleAmenityChange}
          name="wifi"
        />
        <Checkbox
          icon={<LocalParkingIcon />}
          checkedIcon={<LocalParkingIcon color="info" />}
          checked={amenityFilters.parking}
          onChange={handleAmenityChange}
          name="parking"
        />
        <Checkbox
          icon={<FreeBreakfastIcon />}
          checkedIcon={<FreeBreakfastIcon color="info" />}
          checked={amenityFilters.breakfast}
          onChange={handleAmenityChange}
          name="breakfast"
        />
        <Checkbox
          icon={<PetsIcon />}
          checkedIcon={<PetsIcon color="info" />}
          checked={amenityFilters.pets}
          onChange={handleAmenityChange}
          name="pets"
        />
      </Stack>
    </Container>
  );
};

export default SortAndFilter;
