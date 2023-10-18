import { create } from "zustand";
import apiFetcher from "../utils/apiFetcher";

// Venues store for storing venues and selected venue and api status
const useVenuesStore = create((set) => ({
  venues: [],
  selectedVenue: null,
  isLoading: false,
  isError: false,

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

export default useVenuesStore;
