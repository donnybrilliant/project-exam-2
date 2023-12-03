import { useState, useEffect } from "react";
import { useSearchStore } from "../../stores";
import {
  Checkbox,
  Stack,
  Container,
  InputLabel,
  Select,
  FormControl,
  Slider,
  Rating,
  Menu,
  Box,
  Typography,
  Chip,
  Divider,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// Sort and filter component
const SortAndFilter = () => {
  const currentSortType = useSearchStore.getState().sortType;
  const updateSortType = useSearchStore((state) => state.updateSortType);
  const filterVenues = useSearchStore((state) => state.filterVenues);
  const reverseFilteredVenues = useSearchStore(
    (state) => state.reverseFilteredVenues
  );
  const searchParams = useSearchStore.getState().searchParams;
  const isReversed = useSearchStore((state) => state.isReversed);
  const MAX_SLIDER_VALUE = useSearchStore((state) => state.maxSliderValue);
  const [amenityFilters, setAmenityFilters] = useState({
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  });
  const [priceRange, setPriceRange] = useState([0, MAX_SLIDER_VALUE]);
  const [minRating, setMinRating] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Check if the filters are the default values
  const areFiltersDefault = () => {
    const defaultFilters = {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    };
    const defaultPriceRange = [0, MAX_SLIDER_VALUE];
    const defaultRating = 0;

    const isAmenityDefault = Object.keys(amenityFilters).every(
      (key) => amenityFilters[key] === defaultFilters[key]
    );
    const isPriceDefault =
      priceRange[0] === defaultPriceRange[0] &&
      priceRange[1] === defaultPriceRange[1];
    const isRatingDefault = minRating === defaultRating;

    return isAmenityDefault && isPriceDefault && isRatingDefault;
  };

  // Check if the value is the max slider value, if so, return "Max"

  const valueLabelFormat = (value) => {
    return value === MAX_SLIDER_VALUE ? "Max" : value;
  };

  // Get the label text for the rating
  const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? "s" : ""}`;
  };

  // Update the sort type or amenity filters
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

  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue);
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

  const clearFilters = () => {
    setPriceRange([0, MAX_SLIDER_VALUE]);
    setMinRating(0);
    setAmenityFilters({
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    filterVenues(
      searchParams.searchTerm,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.guests,
      currentSortType || "default",
      amenityFilters,
      priceRange,
      minRating
    );
  }, [
    amenityFilters,
    currentSortType,
    priceRange,
    minRating,
    filterVenues,
    searchParams,
  ]);

  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        alignItems: "flex-end",
        marginBottom: 1,
        width: "100%",
        gap: 1,
      }}
    >
      <Tooltip title="Sort Venues" arrow>
        <FormControl
          sx={{
            minWidth: "150px",
            "@media (max-width: 380px)": {
              width: "100%",
            },
          }}
          size="small"
        >
          <InputLabel
            id="sort-label"
            sx={{
              "&.MuiInputLabel-sizeSmall": {
                fontSize: 14,
                top: 8,
                left: -14,
              },
            }}
          >
            Sort by
          </InputLabel>
          <Select
            labelId="sort-label"
            id="sort"
            name="sort"
            value={currentSortType || ""}
            onChange={handleSortChange}
            variant="standard"
            sx={{ fontSize: 14 }}
          >
            <MenuItem value="alphabetical">Alphabetical</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
          </Select>
        </FormControl>
      </Tooltip>
      <Tooltip title="Toggle Sort Order" arrow>
        <IconButton
          onClick={handleToggleSortOrder}
          size="small"
          aria-label="Toggle Sort Order"
        >
          {isReversed ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <ArrowDownwardIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="Filter Menu" arrow>
        <IconButton
          id="filter-button"
          aria-controls={open ? "filter-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          size="small"
          aria-label="Filter Venues"
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "filter-button",
        }}
        slotProps={{
          paper: {
            sx: {
              overflow: "visible",
              mt: 2,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 10,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Filters:</Typography>
            {!areFiltersDefault() && (
              <Chip
                label="Clear"
                onClick={() => {
                  handleClose();
                  clearFilters();
                }}
                size="small"
                sx={{ marginRight: -1 }}
                variant="outlined"
                clickable
              />
            )}
          </Box>
          <Divider />
          <Typography>Ameneties:</Typography>
          <Box>
            <Stack direction="row">
              <Checkbox
                icon={<WifiIcon />}
                checkedIcon={<WifiIcon color="info" />}
                checked={amenityFilters.wifi}
                onChange={handleAmenityChange}
                name="wifi"
                inputProps={{
                  "aria-label": "Checkbox for wifi",
                }}
              />
              <Checkbox
                icon={<LocalParkingIcon />}
                checkedIcon={<LocalParkingIcon color="info" />}
                checked={amenityFilters.parking}
                onChange={handleAmenityChange}
                name="parking"
                inputProps={{
                  "aria-label": "Checkbox for parking",
                }}
              />
              <Checkbox
                icon={<FreeBreakfastIcon />}
                checkedIcon={<FreeBreakfastIcon color="info" />}
                checked={amenityFilters.breakfast}
                onChange={handleAmenityChange}
                name="breakfast"
                inputProps={{
                  "aria-label": "Checkbox for breakfast",
                }}
              />
              <Checkbox
                icon={<PetsIcon />}
                checkedIcon={<PetsIcon color="info" />}
                checked={amenityFilters.pets}
                onChange={handleAmenityChange}
                name="pets"
                inputProps={{
                  "aria-label": "Checkbox for pets",
                }}
              />
            </Stack>
          </Box>
          <Divider />
          <Typography id="price-range-label">
            Price Range: {priceRange[0]} - {valueLabelFormat(priceRange[1])}
          </Typography>
          <Box>
            <Slider
              aria-labelledby="price-range-label"
              value={priceRange}
              onChange={(event, newValue) => {
                setPriceRange(newValue);
              }}
              min={0}
              max={MAX_SLIDER_VALUE}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
            />
          </Box>
          <Divider />
          <Typography id="rating-label">
            Rating: {minRating} {minRating === 1 ? "Star" : "Stars"}
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Rating
              id="rating"
              name="min-rating"
              aria-labelledby="rating-label"
              size="large"
              value={minRating}
              onChange={handleRatingChange}
              precision={0.2}
              getLabelText={getLabelText}
            />
          </Box>
        </Container>
      </Menu>
    </Container>
  );
};

export default SortAndFilter;
