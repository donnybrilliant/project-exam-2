import { create } from "zustand";
import { useFetchStore } from "./fetch";
import { useAuthStore } from "./auth";
import { useDialogStore } from "./dialog";
import { useSearchStore } from "./search";

// Venues store for storing venues and selected venue

export const useVenueStore = create((set) => ({
  venues: [],
  selectedVenue: null,

  // AUTH STORE??

  // Action for checking if a user is the owner of a venue
  isOwner: () => {
    const selectedVenue = useVenueStore.getState().selectedVenue;
    const userInfo = useAuthStore.getState().userInfo;
    return userInfo && selectedVenue && selectedVenue.owner
      ? selectedVenue.owner.name === userInfo.name
      : false;
  },

  // Action for fetching all venues.
  fetchAllVenues: async () => {
    const limit = 100;
    let offset = 0;
    let allVenues = [];
    let keepFetching = true;

    // Keep fetching venues until fewer than 100 are returned
    while (keepFetching) {
      const batch = await useFetchStore
        .getState()
        .apiFetch(`venues?_bookings=true&limit=${limit}&offset=${offset}`);

      allVenues = [...allVenues, ...batch];

      // Stop fetching if fewer than 100 venues are returned or update the offset to fetch the next batch
      if (batch.length < limit) {
        keepFetching = false;
      } else {
        offset += limit;
      }
    }
    set({ venues: allVenues });
    useSearchStore.getState().setVenuesAndMaxPrice(allVenues);
  },

  // Action for fetching venues
  fetchVenues: async () => {
    const data = await useFetchStore.getState().apiFetch("venues");
    if (data) {
      set({ venues: data });
    }
  },

  // Action for fetching a single venue
  fetchVenueById: async (id) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`venues/${id}?_owner=true&_bookings=true`);
    if (data) {
      set({ selectedVenue: data });
      return data;
    }
  },

  // Action for creating a venue
  createVenue: async (venueData) => {
    try {
      const response = await useFetchStore
        .getState()
        .apiFetch("venues", "POST", venueData);
      // Update state to include the new venue
      set((state) => ({
        venues: [...state.venues, response],
      }));
      // add other places?
      useFetchStore
        .getState()
        .setSuccessMsg(`Successfully created ${response.name}`);
      return response;
    } catch (error) {
      useFetchStore.getState().setErrorMsg(error.message);
    }
  },

  // Action for updating a venue
  updateVenue: async (id, venueData) => {
    try {
      const response = await useFetchStore
        .getState()
        .apiFetch(`venues/${id}`, "PUT", venueData);
      // Update state to reflect the updated venue
      set((state) => ({
        venues: state.venues.map((venue) =>
          venue.id === id ? { ...venue, ...response } : venue
        ),
      }));
      useFetchStore
        .getState()
        .setSuccessMsg(`Successfully updated ${venueData.name}`);
    } catch (error) {
      useFetchStore.getState().setErrorMsg(error.message);
    }
  },

  // Action for deleting a venue
  deleteVenue: async (id, name) => {
    try {
      await useFetchStore.getState().apiFetch(`venues/${id}`, "DELETE");
      // After deletion, remove the venue from the local state to reflect the change
      set((state) => ({
        venues: state.venues.filter((venue) => venue.id !== id),
      }));
      useFetchStore.getState().setSuccessMsg(`Successfully deleted ${name}`);
    } catch (error) {
      useFetchStore.getState().setErrorMsg(error.message);
    }
  },

  // Action for creating a booking
  bookVenue: async (bookingData) => {
    try {
      await useFetchStore.getState().apiFetch("bookings", "POST", bookingData);
      useFetchStore
        .getState()
        .setSuccessMsg(`Booking at ${bookingData.name} was successful!`);
    } catch (error) {
      useFetchStore.getState().setErrorMsg(error.message);
    } finally {
      useDialogStore.getState().closeDialog();
    }
  },

  // Action for deleting a booking
  deleteBooking: async (id, name) => {
    try {
      await useFetchStore.getState().apiFetch(`bookings/${id}`, "DELETE");
      // After deletion, remove the venue from the local state to reflect the change??
      //name should be capitalized
      useFetchStore
        .getState()
        .setSuccessMsg(`Successfully deleted booking at ${name}`);
    } catch (error) {
      return useFetchStore.getState().setErrorMsg(error.message);
    } finally {
      useDialogStore.getState().closeDialog();
    }
  },
}));
