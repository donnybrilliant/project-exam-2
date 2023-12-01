import { useEffect } from "react";
import { useVenueStore } from "../../stores";
import Container from "@mui/material/Container";
import { Button, Typography } from "@mui/material";
import Search from "../../components/Search";
import VenueCarousel from "../../components/VenueCarousel";
import Box from "@mui/material/Box";
import { LogoIcon } from "../../components/Layout/Header/Logo";

import Paper from "@mui/material/Paper";

// This component is used to display a home page with a list of venues
const Home = () => {
  // Get states and actions from venuesStore
  const fetchAllVenues = useVenueStore((state) => state.fetchAllVenues);
  const venues = useVenueStore((state) => state.venues);

  // Fetch venues when component mounts
  useEffect(() => {
    fetchAllVenues();
  }, [fetchAllVenues]);

  /*   const aDate = venues[0]?.bookings[0].dateFrom;
  const finalDate = dayjs(aDate);
  console.log(finalDate); */

  // Top Rated Venues: Sort by rating in descending order
  const topRatedVenues = [...venues]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Most Popular Venues: Sort by booking count in descending order
  const mostPopularVenues = [...venues]
    .sort((a, b) => b.bookings.length - a.bookings.length)
    .slice(0, 10);

  // Newest Venues: Sort by created date in descending order (newest first)
  const newVenues = [...venues]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 10);

  return (
    <>
      <Container>
        <Search />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
            my: 20,
          }}
        >
          <Box
            sx={{
              width: "400px",
            }}
          >
            <Typography variant="h1" gutterBottom>
              Welcome to Holidaze
            </Typography>
            <Typography variant="h2" sx={{ marginBlock: 2.5 }}>
              Your Personalized Holiday Planner
            </Typography>
            <Typography gutterBottom>
              Search for your next holiday destination in the search bar above,
              or browse our top rated, most popular, and newest venues below.
            </Typography>
          </Box>

          <LogoIcon
            sx={{
              width: 150,
              height: 150,
              backgroundColor: "primary.main",
              borderRadius: "50%",
            }}
            color="white"
          />
        </Box>

        <Typography variant="h4" component="h2" marginTop={5} gutterBottom>
          Top Rated Venues
        </Typography>
        <VenueCarousel venues={topRatedVenues} />
        <Typography variant="h4" component="h2" marginTop={5} gutterBottom>
          Most Popular Venues
        </Typography>
        <VenueCarousel venues={mostPopularVenues} />
        <Typography variant="h4" component="h2" marginTop={5} gutterBottom>
          Newest Venues
        </Typography>
        <VenueCarousel venues={newVenues} />
      </Container>

      <Container
        disableGutters
        maxWidth="false"
        sx={{ my: 10, p: 10, backgroundColor: "primary.main" }}
      >
        <Typography variant="h5" gutterBottom>
          Your Perfect Getaway is Just a Click Away!
        </Typography>
        <Typography paragraph>
          Dive into a plethora of venues that cater to every discerning
          traveler. Whether you're eyeing a serene countryside retreat or a
          bustling city escape, Holidaze is your go-to platform for a tailored
          holiday experience.
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
          Discover Top Venues
        </Button>
      </Container>
      <Container
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Paper
          sx={{
            p: 3,
            width: { xs: "100%", sm: "29%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Explore at Your Fingertips
          </Typography>
          <Typography paragraph>
            Our easy-to-navigate platform opens up a world of venues for you to
            explore and book. Your next holiday is just a browse away.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Browse Venues
          </Button>
        </Paper>
        <Paper
          sx={{
            p: 3,
            width: { xs: "100%", sm: "29%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Seamlessly Manage Your Bookings
          </Typography>
          <Typography paragraph>
            With Holidaze, managing your bookings is a breeze. Access your
            personal dashboard to view, edit, or cancel your bookings anytime,
            anywhere.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Go to Dashboard
          </Button>
        </Paper>
        <Paper
          sx={{
            p: 3,
            width: { xs: "100%", sm: "29%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Empowering Venue Managers
          </Typography>
          <Typography paragraph>
            Are you a venue owner? Join Holidaze to list your venue, manage
            bookings, and connect with potential customers effortlessly.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Register Venue
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
