import VenueCard from "../VenueCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// This component is used to display a list of venues
const VenueList = ({ venues }) => {
  return (
    <>
      {venues.length === 0 ? (
        <Typography>No venues found</Typography>
      ) : (
        <>
          <Typography
            variant="body2"
            sx={{ marginBottom: 1 }}
            textAlign="right"
          >
            {venues.length} venues found
          </Typography>
          <Grid container spacing={4}>
            {venues.map((venue) => (
              <Grid item key={venue.id} xs={12} sm={6} md={4}>
                <VenueCard venue={venue} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
};

export default VenueList;
