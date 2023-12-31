import { create } from "zustand";
import { useFetchStore } from "./fetch";
import { useDialogStore } from "./dialog";
import { useProfileStore } from "./profile";

export const useBookingStore = create((set) => ({
  guests: 1,
  dateRange: [null, null],
  setGuests: (guests) => set({ guests }),
  setDateRange: (dateRange) => set({ dateRange }),

  // Action for resetting the booking store
  reset: () => set({ guests: 1, dateRange: [null, null] }),

  // Action for fetching a booking by id
  getBooking: async (id) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`bookings/${id}?_customer=true&_venue=true`);
    return data;
  },

  // Action for creating a booking
  bookVenue: async (name, bookingData) => {
    try {
      await useFetchStore.getState().apiFetch("bookings", "POST", bookingData);
      useFetchStore
        .getState()
        .setSuccessMsg(`Booking at ${name} was successful!`);
    } catch (error) {
      useFetchStore.getState().setErrorMsg(error.message);
    } finally {
      useDialogStore.getState().closeDialog();
    }
  },

  // Action for creating a booking
  updateBooking: async (id, name, bookingData) => {
    try {
      await useFetchStore
        .getState()
        .apiFetch(`bookings/${id}`, "PUT", bookingData);
      useProfileStore.getState().updateVenueBookings();
      useFetchStore.getState().setSuccessMsg(`Successfully updated ${name}`);
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
      useProfileStore.getState().removeBookingFromVenues(id);
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
