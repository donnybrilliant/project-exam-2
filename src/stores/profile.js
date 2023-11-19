import { create } from "zustand";
import { useFetchStore } from "./fetch";
import { useAuthStore } from "./auth";

// Profiles store for fetching profiles and selected profile

export const useProfileStore = create((set) => ({
  profiles: [],
  selectedProfile: null,
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
}));
