import { useEffect, useState } from "react";
import { useVenueStore, useFavoritesStore } from "../../stores";
import { Container, Typography } from "@mui/material";
import VenueCarousel from "../../components/VenueCarousel";

const FavoritesList = () => {
  const fetchVenueById = useVenueStore((state) => state.fetchVenueById);
  const favorites = useFavoritesStore((state) => state.favorites);
  const [favoriteVenues, setFavoriteVenues] = useState([]);

  useEffect(() => {
    const fetchFavoriteVenues = async () => {
      const venueDetails = await Promise.all(
        favorites.map((venueId) => fetchVenueById(venueId))
      );
      setFavoriteVenues(venueDetails);
    };

    fetchFavoriteVenues();
  }, [favorites, fetchVenueById]);

  return (
    // "View your favorites here" when empty?
    <Container disableGutters className="marginBlock">
      {favoriteVenues.length > 0 && (
        <>
          <Typography variant="h2" sx={{ marginBlock: 1 }}>
            My Favorite Venues
          </Typography>
          <Typography variant="caption">
            Favorites will disappear on logout
          </Typography>
        </>
      )}
      <VenueCarousel venues={favoriteVenues} />
    </Container>
  );
};

export default FavoritesList;
