import React from "react";
import { Box } from "@mui/material";
import VenueCard from "../VenueCard";
import { useFetchStore } from "../../stores";
import { VenueCardSkeleton } from "../Skeletons";

const VenueCarousel = ({ venues }) => {
  const isLoading = useFetchStore((state) => state.isLoading);
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        scrollbarWidth: "none", // For Firefox
        // Double check if this is needed
        "&::-webkit-scrollbar": {
          // For Chrome, Safari, and Edge
          display: "none",
        },
        "> *": { flexShrink: 0 },
      }}
    >
      {isLoading
        ? Array.from(new Array(4)).map((item, index) => (
            <Box key={index} sx={{ margin: 1, width: "330px" }}>
              <VenueCardSkeleton />
            </Box>
          ))
        : venues.map((venue, index) => (
            <Box key={index} sx={{ margin: 1 }}>
              <VenueCard venue={venue} />
            </Box>
          ))}
    </Box>
  );
};

export default VenueCarousel;
