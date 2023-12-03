import { create } from "zustand";
import { useFetchStore } from "./fetch";
import { useDialogStore } from "./dialog";

export const useBookingStore = create((set) => ({
  guests: 1,
  dateRange: [null, null],
  setGuests: (guests) => set({ guests }),
  setDateRange: (dateRange) => set({ dateRange }),

  reset: () => set({ guests: 1, dateRange: [null, null] }),
  // Action for fetching a booking by id
  getBooking: async (id) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`bookings/${id}?_customer=true&_venue=true`);
    return data;
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

  // Action for creating a booking
  updateBooking: async (id, name, bookingData) => {
    try {
      await useFetchStore
        .getState()
        .apiFetch(`bookings/${id}`, "PUT", bookingData);
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
