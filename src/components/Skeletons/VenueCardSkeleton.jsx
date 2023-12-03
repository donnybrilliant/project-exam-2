import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Box,
  IconButton,
  Skeleton,
} from "@mui/material";

// This component is used to display a skeleton for a venue card
const VenueCardSkeleton = () => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardMedia>
          <Skeleton variant="rectangular" height={140} />
        </CardMedia>
        <CardContent>
          <Skeleton />
          <Skeleton />
        </CardContent>
        <CardActionArea
          sx={{
            padding: 2,
            paddingTop: 0.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton variant="circular">
              <IconButton size="large" component="span" />
            </Skeleton>
            <Skeleton variant="circular">
              <IconButton size="large" component="span" />
            </Skeleton>
            <Skeleton variant="circular">
              <IconButton size="large" component="span" />
            </Skeleton>
            <Skeleton variant="circular">
              <IconButton size="large" component="span" />
            </Skeleton>
          </Box>
          <Skeleton
            sx={{
              height: 30,
              width: 120,
            }}
          />
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default VenueCardSkeleton;
