import { create } from "zustand";
import apiFetcher from "../utils/apiFetcher";

// Venues store for storing venues and selected venue and api status
const useVenueStore = create((set) => ({
  venues: [],
  selectedVenue: null,
  isLoading: false,
  isError: false,
  openImageIndex: null,
  setOpenImageIndex: (indexOrFunction) =>
    set((state) => {
      const newIndex =
        typeof indexOrFunction === "function"
          ? indexOrFunction(state.openImageIndex)
          : indexOrFunction;
      return { openImageIndex: newIndex };
    }),

  // Fetch all venues
  fetchVenues: async (token) => {
    try {
      set({ isLoading: true, isError: false });
      const data = await apiFetcher("venues", token);
      set({ venues: data, isLoading: false, isError: false });
    } catch (error) {
      set({ isError: true, isLoading: false });
      console.error(error);
    }
  },

  // Fetch a venue by id
  fetchVenueById: async (id, token) => {
    try {
      set({ isLoading: true, isError: false });
      const data = await apiFetcher(`venues/${id}`, token);
      set({ selectedVenue: data, isLoading: false, isError: false });
    } catch (error) {
      set({ isError: true, isLoading: false });
      console.error(error);
    }
  },
}));

export default useVenueStore;
