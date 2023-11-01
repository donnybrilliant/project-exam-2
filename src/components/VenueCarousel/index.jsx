import React from "react";
import { Box } from "@mui/material";
import VenueCard from "../VenueCard";

const VenueCarousel = ({ venues }) => {
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        scrollbarWidth: "none", // For Firefox
        "&::-webkit-scrollbar": {
          // For Chrome, Safari, and Edge
          display: "none",
        },
      }}
    >
      {venues.map((venue, index) => (
        <Box key={index} sx={{ margin: 1 }}>
          <VenueCard venue={venue} />
        </Box>
      ))}
    </Box>
  );
};

export default VenueCarousel;
