import VenueCard from "../VenueCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SortAndFilter from "../SortAndFilter";
import Container from "@mui/material/Container";
import { useFetchStore } from "../../stores";
import { VenueCardSkeleton } from "../Skeletons";

// This component is used to display a list of venues
const VenueList = ({ venues }) => {
  const isLoading = useFetchStore((state) => state.isLoading);

  if (venues) {
    return (
      <>
        <Container
          disableGutters
          sx={{
            display: "flex",
            alignItems: "flex-end",
            flexWrap: "nowrap", // prevent wrapping by default
            justifyContent: "space-between", // this will space out your SortAndFilter and Typography
            "@media (max-width: 380px )": {
              flexWrap: "wrap", // allow wrapping when the viewport width is less than a certain breakpoint
            },
          }}
        >
          <SortAndFilter />
          <Typography
            variant="body2"
            sx={{
              minWidth: "130px",
              marginBottom: 1.5,
              "@media (max-width: 380px)": {
                width: "100%", // full width on smaller screens to ensure it goes to the next line

                marginTop: 1, // add some space above when on its own line
              },
              textAlign: "right", // center it if you'd like
            }}
          >
            {venues.length} venues found
          </Typography>
        </Container>
        <Grid container spacing={4}>
          {isLoading
            ? Array.from(new Array(9)).map((item, index) => (
                <VenueCardSkeleton key={index} />
              ))
            : venues.map((venue) => (
                <Grid item key={venue.id} xs={12} sm={6} md={4}>
                  <VenueCard venue={venue} />
                </Grid>
              ))}
        </Grid>
      </>
    );
  } else if (venues && venues.length === 0) {
    return <Typography>No venues found</Typography>;
  }
};

export default VenueList;
