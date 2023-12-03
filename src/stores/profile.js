import { create } from "zustand";
import { useFetchStore } from "./fetch";
import { useAuthStore } from "./auth";
import { useBookingStore } from "./booking";

// Profiles store for fetching profiles and selected profile
export const useProfileStore = create((set, get) => ({
  profiles: [],
  selectedProfile: null,
  userVenues: [],
  userBookings: [],
  venueBookings: [],

  // Method to remove a booking from venueBookings
  removeBookingFromVenues: (bookingId) => {
    const updatedVenueBookings = get().venueBookings.filter(
      (booking) => booking.id !== bookingId
    );
    set({ venueBookings: updatedVenueBookings });
  },
  // Function to update venue bookings
  updateVenueBookings: async () => {
    const userVenues = get().userVenues;
    const getBooking = useBookingStore.getState().getBooking;

    const bookingsPromises = userVenues.flatMap((venue) =>
      venue.bookings
        .filter((booking) => booking.id)
        .map((booking) => getBooking(booking.id))
    );

    const bookingsDetails = (await Promise.all(bookingsPromises)).filter(
      Boolean
    ); // Filter out null values
    set({ venueBookings: bookingsDetails });
  },

  // Action for fetching all profiles
  clearSelectedProfile: () => set({ selectedProfile: null }),

  // Action for removing a venue from userVenues
  removeUserVenue: (id) => {
    set((state) => ({
      userVenues: state.userVenues.filter((venue) => venue.id !== id),
    }));
  },

  // Action for removing a booking from userBookings
  removeUserBooking: (id) => {
    set((state) => ({
      userBookings: state.userBookings.filter((booking) => booking.id !== id),
    }));
  },

  // Action for fetching a single profile
  fetchProfileByName: async (name) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`profiles/${name}?_venues=true&_bookings=true`);
    if (data) {
      set({ selectedProfile: data });
    }
  },

  // Action for fetching venues by profile name
  fetchUserVenues: async (name) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`profiles/${name}/venues?_bookings=true`);
    if (data) {
      set({ userVenues: data });
    }
  },

  // Action for fetching bookings by profile name
  fetchUserBookings: async (name) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`profiles/${name}/bookings?_venue=true`);
    if (data) {
      set({ userBookings: data });
    }
  },

  // Action for updating a avatar
  updateAvatar: async (newAvatarUrl) => {
    // Utilize apiFetch from useFetchStore for the PUT request
    const name = useAuthStore.getState().userInfo.name;
    const updatedProfile = await useFetchStore
      .getState()
      .apiFetch(`profiles/${name}/media`, "PUT", { avatar: newAvatarUrl });

    // Update avatar URL in useAuthStore
    useAuthStore.getState().updateUserInfo({
      avatar: updatedProfile.avatar,
    });
  },

  // Action for becoming a venue manager
  updateVenueManagerStatus: async (newStatus) => {
    // Get the name from the userInfo in the auth store
    const name = useAuthStore.getState().userInfo.name;

    // Send the update request to the backend
    const updatedProfile = await useFetchStore
      .getState()
      .apiFetch(`profiles/${name}`, "PUT", { venueManager: newStatus });

    // Update the selectedProfile state
    set((state) => ({
      selectedProfile: {
        ...state.selectedProfile,
        venueManager: updatedProfile.venueManager,
      },
    }));

    // Update userInfo in the auth store
    useAuthStore.getState().updateUserInfo({
      venueManager: updatedProfile.venueManager,
    });
  },
}));
