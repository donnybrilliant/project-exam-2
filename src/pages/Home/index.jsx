import { useEffect } from "react";
import { useVenueStore } from "../../stores";
import Search from "../../components/Search";
import VenueCarousel from "../../components/VenueCarousel";
import { LogoIcon } from "../../components/Layout/Header/Logo";
import { Button, Typography, Container, Box, Paper } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// This component is used to display a home page with a list of venues
const Home = () => {
  // Get states and actions from venuesStore
  const fetchAllVenues = useVenueStore((state) => state.fetchAllVenues);
  const venues = useVenueStore((state) => state.venues);

  // Fetch venues when component mounts
  useEffect(() => {
    fetchAllVenues();
  }, [fetchAllVenues]);

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
            my: { xs: 5, sm: 20 },
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

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 15 }}
        >
          <Typography variant="h4" component="h2">
            Top Rated Venues
          </Typography>
          <ChevronRightIcon />
        </Box>
        <VenueCarousel venues={topRatedVenues} />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 5 }}
        >
          <Typography variant="h4" component="h2">
            Most Popular Venues
          </Typography>
          <ChevronRightIcon />
        </Box>
        <VenueCarousel venues={mostPopularVenues} />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 5 }}
        >
          <Typography variant="h4" component="h2">
            Newest Venues
          </Typography>
          <ChevronRightIcon />
        </Box>
        <VenueCarousel venues={newVenues} />
      </Container>

      <Container
        disableGutters
        maxWidth="false"
        sx={{
          my: 20,
          py: 10,
          px: { xs: 4, sm: 20 },
          backgroundColor: "primary.main",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Your Perfect Getaway is Just a Click Away!
        </Typography>
        <Typography paragraph>
          Dive into a plethora of venues that cater to every discerning
          traveler. Whether you&apos;re eyeing a serene countryside retreat or a
          bustling city escape, Holidaze is your go-to platform for a tailored
          holiday experience.
        </Typography>
        <Button
          variant="contained"
          color="info"
          size="large"
          sx={{ mt: 3 }}
          href="/venues"
        >
          Discover Venues
        </Button>
      </Container>
      <Container
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "space-between",
          flexWrap: "wrap",
          my: 20,
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
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/venues"
          >
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
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/dashboard"
          >
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
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/venuemanager/register"
          >
            Register Venue
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
