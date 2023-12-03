import { useFetchStore } from "../../stores";
import VenueCard from "../VenueCard";
import { VenueCardSkeleton } from "../Skeletons";
import { Box } from "@mui/material";

// This component is used to display a carousel of VenenueCards
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
