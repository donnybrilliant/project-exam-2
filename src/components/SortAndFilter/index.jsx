import React, { useState } from "react";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useVenueStore } from "../../stores";

const SortAndFilter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const updateSortType = useVenueStore((state) => state.updateSortType);
  const filterVenues = useVenueStore((state) => state.filterVenues);
  const reverseFilteredVenues = useVenueStore(
    (state) => state.reverseFilteredVenues
  );
  const searchParams = useVenueStore.getState().searchParams;
  const isReversed = useVenueStore((state) => state.isReversed);

  const handleToggleSortOrder = () => {
    reverseFilteredVenues();
  };

  const handleSortChange = (type) => {
    updateSortType(type);
    filterVenues(
      searchParams.searchTerm,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.guests,
      type
    );
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (type) => {
    handleSortChange(type);
  };

  return (
    <>
      <IconButton onClick={handleToggleSortOrder}>
        {isReversed ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </IconButton>
      <Button onClick={handleMenuOpen}>Sort</Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleSort("alphabetical")}>
          Alphabetical
        </MenuItem>
        <MenuItem onClick={() => handleSort("price")}>Price</MenuItem>
        <MenuItem onClick={() => handleSort("created")}>Created</MenuItem>
        <MenuItem onClick={() => handleSort("rating")}>Rating</MenuItem>
        <MenuItem onClick={() => handleSort("popularity")}>Popularity</MenuItem>
      </Menu>
    </>
  );
};

export default SortAndFilter;
