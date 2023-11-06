import { useState, useEffect } from "react";
import { MenuItem, IconButton, Tooltip } from "@mui/material";
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
  Slider,
  Rating,
  Menu,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FreeBreakfastIcon from "@mui/icons-material/FreeBreakfast";
import PetsIcon from "@mui/icons-material/Pets";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const SortAndFilter = () => {
  const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? "s" : ""}`;
  };

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

  const MAX_SLIDER_VALUE = useVenueStore((state) => state.maxSliderValue);
  const valueLabelFormat = (value) => {
    // Check if the value is at max and return 'Max' or the value itself accordingly
    return value === MAX_SLIDER_VALUE ? "Max" : value;
  };
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
  const [priceRange, setPriceRange] = useState([0, MAX_SLIDER_VALUE]);
  const [minRating, setMinRating] = useState(0);
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
  }, [amenityFilters, currentSortType, priceRange, minRating]);

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
            value={currentSortType || ""}
            label="Sort by"
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
      <Tooltip title="Order Venues" arrow>
        <IconButton onClick={handleToggleSortOrder} size="small">
          {isReversed ? (
            <ArrowUpwardIcon fontSize="small" />
          ) : (
            <ArrowDownwardIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="Filter Venues" arrow>
        <IconButton
          id="filter-button"
          aria-controls={open ? "filter-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          size="small"
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
                sx={{ marginRight: -2 }}
                variant="outlined"
                clickable
              />
            )}
          </Box>
          <Box>
            <Typography>Ameneties:</Typography>
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
          <Box>
            <Typography>
              Price Range: {priceRange[0]} - {valueLabelFormat(priceRange[1])}
            </Typography>
            <Slider
              getAriaLabel={() => "Price range"}
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
          Rating: {minRating} {minRating === 1 ? "Star" : "Stars"}
          <Box sx={{ textAlign: "center" }}>
            <Rating
              name="min-rating"
              size="large"
              value={minRating}
              onChange={handleRatingChange}
              // Check consistency with create venue
              precision={0.5}
              getLabelText={getLabelText}
            />
          </Box>
        </Container>
      </Menu>
    </Container>
  );
};

export default SortAndFilter;
