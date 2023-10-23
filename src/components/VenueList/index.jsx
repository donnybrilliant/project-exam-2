import VenueCard from "../VenueCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SearchFilterBar from "../Search";

// This component is used to display a list of venues
const VenueList = ({ venues }) => {
  return (
    <>
      <SearchFilterBar />
      <Grid container spacing={4}>
        {venues.length === 0 ? (
          <Typography>No venues found</Typography>
        ) : (
          venues.map((venue) => (
            <Grid item key={venue.id} xs={12} sm={6} md={4}>
              <VenueCard venue={venue} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default VenueList;
