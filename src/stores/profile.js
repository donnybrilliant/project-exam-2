import { create } from "zustand";
import { useFetchStore } from "./fetch";
import { useAuthStore } from "./auth";

// Profiles store for fetching profiles and selected profile

export const useProfileStore = create((set) => ({
  profiles: [],
  selectedProfile: null,
  userVenues: [],
  userBookings: [],
  clearSelectedProfile: () => set({ selectedProfile: null }),

  // Action for fetching all profiles
  /*   fetchProfiles: async () => {
    const data = await useFetchStore
      .getState()
      .apiFetch("profiles?_venues=true&_bookings=true");
    if (data) {
      set({ venues: data });
    }
  }, */

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

  // maybe not neccessary with name here..
  updateAvatar: async (newAvatarUrl) => {
    // Utilize apiFetch from useFetchStore for the PUT request
    const name = useAuthStore.getState().userInfo.name;
    const updatedProfile = await useFetchStore
      .getState()
      .apiFetch(`profiles/${name}/media`, "PUT", { avatar: newAvatarUrl });

    // Is this neccessary?
    // If successful, update selectedProfile and userInfo with the new avatar URL
    /*     set((state) => ({
      selectedProfile: {
        ...state.selectedProfile,
        avatar: updatedProfile.avatar,
      },
    }));
*/
    // Update avatar URL in useAuthStore
    useAuthStore.getState().updateUserInfo({
      avatar: updatedProfile.avatar,
    });
  },

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
