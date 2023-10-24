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
        const text = await response.text(); // Try to read text even if it's not JSON
        let errorData;
        try {
          errorData = JSON.parse(text); // Try to parse text as JSON
        } catch {
          errorData = { message: text }; // If parsing fails, wrap text in an object
        }
        const errorMessage =
          (errorData.errors && errorData.errors[0].message) ||
          `${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const text = await response.text();
      if (text) {
        // Only parse as JSON if there's a response body
        const data = JSON.parse(text);
        set({ isLoading: false, isError: false });
        return data;
      }
      set({ isLoading: false, isError: false });
      return null; // Return null if there's no response body
    } catch (error) {
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
      updateUserInfo: (updatedInfo) => {
        set((state) => ({
          userInfo: {
            ...state.userInfo,
            ...updatedInfo,
          },
        }));
      },
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
  filteredVenues: [],
  selectedVenue: null,

  fetchAllVenues: async () => {
    const limit = 100;
    const offset = 0;
    const firstBatch = await useFetchStore
      .getState()
      .apiFetch(`venues?_bookings=true&limit=${limit}&offset=${offset}`);
    const secondBatch = await useFetchStore
      .getState()
      .apiFetch(`venues?_bookings=true&limit=${limit}&offset=${limit}`);
    const allVenues = [...firstBatch, ...secondBatch];
    set({ venues: allVenues, filteredVenues: allVenues }); // Initialize filteredVenues here
  },

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
      return data;
    }
  },
  createVenue: async (venueData) => {
    const data = await useFetchStore
      .getState()
      .apiFetch("venues", "POST", venueData);
    console.log(data);

    // I dont think i need this.. For testing!!
    /*  if (data) {
      // Assuming your API returns the newly created venue,
      // you could add it to the venues array in the state.
      set((state) => ({
        venues: [...state.venues, data]
      }));
    } */
  },
  updateVenue: async (id, venueData) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`venues/${id}`, "PUT", venueData);
    console.log(data);
  },

  deleteVenue: async (id) => {
    await useFetchStore.getState().apiFetch(`venues/${id}`, "DELETE");
    // After deletion, remove the venue from the local state to reflect the change
    set((state) => ({
      venues: state.venues.filter((venue) => venue.id !== id),
      selectedVenue:
        state.selectedVenue?.id === id ? null : state.selectedVenue,
    }));
  },

  filterVenues: (searchTerm, startDate, endDate) => {
    set((state) => {
      const lowerCaseTerm = searchTerm.toLowerCase();

      const filtered = state.venues.filter((venue) => {
        // Text Search
        const textMatch = [
          venue.name,
          venue.location.city,
          venue.location.address,
          venue.location.continent,
          venue.location.country,
          venue.location.zip,
        ].some((field) => field && field.toLowerCase().includes(lowerCaseTerm));

        // Date Range Search
        const dateMatch = !venue.bookings.some((booking) => {
          return (
            (startDate &&
              booking.dateFrom <= startDate &&
              booking.dateTo >= startDate) ||
            (endDate &&
              booking.dateFrom <= endDate &&
              booking.dateTo >= endDate)
          );
        });

        return textMatch && dateMatch;
      });

      return { filteredVenues: filtered }; // return the new state value
    });
  },
  bookVenue: async (bookingData) => {
    const data = await useFetchStore
      .getState()
      .apiFetch("bookings", "POST", bookingData);
  },
  deleteBooking: async (id) => {
    const data = await useFetchStore
      .getState()
      .apiFetch(`bookings/${id}`, "DELETE");
    // Update some state??
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
