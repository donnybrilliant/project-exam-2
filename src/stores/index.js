import { create } from "zustand";
import { persist } from "zustand/middleware";

const BASE_URL = "https://api.noroff.dev/api/v1/holidaze";

export const useFetchStore = create((set) => ({
  isLoading: false,
  isError: false,
  errorMsg: null,
  // Generic fetch action
  apiFetch: async (endpoint, method = "GET", body = null) => {
    set({ isLoading: true, isError: false, errorMsg: null });

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + useAuthStore.getState().token,
    };

    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          (errorData.errors && errorData.errors[0].message) ||
          `${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      set({ isLoading: false, isError: false });
      return data;
    } catch (error) {
      // This block will now catch both expected HTTP errors and unexpected errors
      console.error(error);
      set({
        isLoading: false,
        isError: true,
        errorMsg: error.message || "An unexpected error occurred",
      });
    }
  },
}));

// Auth store for storing token and userInfo persistently
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      /*  setAuthInfo: (token, userInfo) => {
        set({ token, userInfo });
      }, */
      clearAuthInfo: () => {
        set({ token: null, userInfo: null });
      },
      login: async (email, password) => {
        const data = await useFetchStore
          .getState()
          .apiFetch("auth/login", "POST", { email, password });

        if (data) {
          const userInfo = {
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            venueManager: data.venueManager,
          };
          set({ token: data.accessToken, userInfo });
        }
      },
    }),
    {
      name: "auth_store",
    }
  )
);

// Theme store for storing colorMode persistently
export const useThemeStore = create(
  persist(
    (set) => ({
      colorMode: "light",
      toggleColorMode: () => {
        set((state) => ({
          colorMode: state.colorMode === "light" ? "dark" : "light",
        }));
      },
    }),
    {
      name: "theme_store",
    }
  )
);

// Venues store for storing venues and selected venue

export const useVenueStore = create((set) => ({
  venues: [],
  selectedVenue: null,

  // Action for fetching all venues
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
    }
  },
}));

export const useGalleryStore = create((set) => ({
  openImageIndex: null,
  setOpenImageIndex: (index) => set({ openImageIndex: index }),
  goToNextImage: (mediaLength) =>
    set((state) => {
      const newIndex =
        state.openImageIndex < mediaLength - 1 ? state.openImageIndex + 1 : 0;
      return { openImageIndex: newIndex };
    }),
  goToPreviousImage: (mediaLength) =>
    set((state) => {
      const newIndex =
        state.openImageIndex > 0 ? state.openImageIndex - 1 : mediaLength - 1;
      return { openImageIndex: newIndex };
    }),
}));

// Profiles store for fetching profiles and selected profile
export const useProfileStore = create((set) => ({
  profiles: [],
  selectedProfile: null,

  // Action for fetching all profiles
  fetchProfiles: async () => {
    const data = await useFetchStore
      .getState()
      .apiFetch("profiles?_venues=true&_bookings=true");
    if (data) {
      set({ venues: data });
    }
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
}));
