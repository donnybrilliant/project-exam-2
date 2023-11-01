import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore, useFetchStore, useProfileStore } from "../../stores";
import { Container, Typography, Button } from "@mui/material";
import BookingList from "../../components/BookingList";
import MyVenueList from "../../components/MyVenueList";
import UserInfo from "../../components/UserInfo";

// Should show total number of bookings for each venue in list and total for user.
// Remember to filter upcoming and past bookings
const Dashboard = () => {
  const isLoading = useFetchStore((state) => state.isLoading);
  const userInfo = useAuthStore((state) => state.userInfo);
  const userName = userInfo.name;
  const fetchProfileByName = useProfileStore(
    (state) => state.fetchProfileByName
  );

  useEffect(() => {
    fetchProfileByName(userName);
  }, [userName]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  //console.log(selectedProfile);
  return (
    <>
      <Container sx={{ textAlign: "center" }}>
        <Typography>Dashboard</Typography>
        <UserInfo />
        <Button
          variant="contained"
          component={Link}
          to={"/dashboard/venues/create"}
          sx={{ marginBlock: 2 }}
        >
          Create Venue
        </Button>
        <h2>Your Bookings</h2>

        <BookingList />
        <h2>Your Venues</h2>
        <MyVenueList />
      </Container>
    </>
  );
};

export default Dashboard;
