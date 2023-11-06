import React, { useState } from "react";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useVenueStore } from "../../stores";

const SortAndFilter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const sortOrder = useVenueStore((state) => state.sortOrder);
  const updateSortType = useVenueStore((state) => state.updateSortType);
  const updateSortOrder = useVenueStore((state) => state.updateSortOrder);
  const filterVenues = useVenueStore((state) => state.filterVenues);
  const searchParams = useVenueStore.getState().searchParams;
  const currentSortType = useVenueStore.getState().sortType;
  const reverseFilteredVenues = useVenueStore(
    (state) => state.reverseFilteredVenues
  );

  const handleToggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    updateSortOrder(newOrder); // Update sortOrder in Zustand store

    if (!currentSortType) {
      reverseFilteredVenues(); // Use the action from the store to reverse the list
    } else {
      handleSortChange(currentSortType, newOrder);
    }
  };

  const handleSortChange = (type, order) => {
    updateSortType(type);
    updateSortOrder(order);
    filterVenues(
      searchParams.searchTerm,
      searchParams.startDate,
      searchParams.endDate,
      searchParams.guests,
      type,
      order
    );
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // This function is called when an item from the sort menu is selected.
  const handleSort = (type) => {
    // Set the sort type in the store
    updateSortType(type);

    // If a new sort type is selected, we default the sort order to 'asc'
    updateSortOrder("asc");

    // Then, apply the sort with the new sort type and default order
    handleSortChange(type, "asc");
  };

  return (
    <>
      <IconButton onClick={handleToggleSortOrder}>
        {sortOrder === "desc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
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
