import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (venueId) => {
        const { favorites } = get();
        set({ favorites: [...favorites, venueId] });
      },
      removeFavorite: (venueId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((id) => id !== venueId) });
      },
      clearFavorites: () => {
        set({ favorites: [] });
      },
      isFavorite: (venueId) => {
        const { favorites } = get();
        return favorites.includes(venueId);
      },
    }),
    {
      name: "favorites",
    }
  )
);
