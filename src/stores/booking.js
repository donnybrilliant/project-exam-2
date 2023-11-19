import { create } from "zustand";
import { useFetchStore } from "./fetch";
import { useDialogStore } from "./dialog";

export const useBookingStore = create((set) => ({
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
