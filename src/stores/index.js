import { create } from "zustand";
import { persist } from "zustand/middleware";

const BASE_URL = "https://api.noroff.dev/api/v1/holidaze";

export const useFetchStore = create((set) => ({
  isLoading: false,
  isError: false,
  errorMsg: null,
  successMsg: null,
  setErrorMsg: (msg) => set({ errorMsg: msg }),
  setSuccessMsg: (msg) => set({ successMsg: msg }),
  clearMessages: () => set({ errorMsg: null, successMsg: null }),
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
      throw error;
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
      register: async (name, email, password, avatar) => {
        const data = await useFetchStore
          .getState()
          .apiFetch("auth/register", "POST", {
            name,
            email,
            password,
            avatar,
          });
        return data;
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
          useFetchStore
            .getState()
            .setSuccessMsg(`Successfully logged in as ${data.name}`);
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
  searchParams: {
    searchTerm: "",
    startDate: null,
    endDate: null,
    guests: "1",
  },
  sortType: null,
  // sortOrder is removed
  updateSortType: (type) => set({ sortType: type }),
  // updateSortOrder is removed

  isReversed: false,

  reverseFilteredVenues: () =>
    set((state) => ({
      filteredVenues: [...state.filteredVenues].reverse(),
      isReversed: !state.isReversed,
    })),

  // Action for checking if a user is the owner of a venue
  isOwner: () => {
    const selectedVenue = useVenueStore.getState().selectedVenue;
    const userInfo = useAuthStore.getState().userInfo;
    return userInfo && selectedVenue && selectedVenue.owner
      ? selectedVenue.owner.name === userInfo.name
      : false;
  },

  // Action for updating search params
  updateStoreSearchParams: (newSearchParams) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...newSearchParams },
    })),

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

    set({ venues: allVenues, filteredVenues: allVenues });
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

  filterVenues: (
    searchTerm,
    startDate,
    endDate,
    guests,
    sortType,
    amenitiesFilters
  ) => {
    set((state) => {
      const lowerCaseTerm = searchTerm ? searchTerm.toLowerCase() : "";

      let newFilteredVenues = state.venues.filter((venue) => {
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

        // Guest Count Search
        const guestMatch = venue.maxGuests >= guests; // Assuming venue has a capacity property

        return textMatch && dateMatch && guestMatch; // Include guestMatch in the return condition
      });

      if (amenitiesFilters) {
        newFilteredVenues = newFilteredVenues.filter((venue) => {
          return (
            (!amenitiesFilters.wifi ||
              venue.meta.wifi === amenitiesFilters.wifi) &&
            (!amenitiesFilters.parking ||
              venue.meta.parking === amenitiesFilters.parking) &&
            (!amenitiesFilters.breakfast ||
              venue.meta.breakfast === amenitiesFilters.breakfast) &&
            (!amenitiesFilters.pets ||
              venue.meta.pets === amenitiesFilters.pets)
            // ... add other amenities checks here ...
          );
        });
      }

      if (sortType) {
        newFilteredVenues.sort((a, b) => {
          let comparison = 0;
          switch (sortType) {
            case "alphabetical":
              comparison = a.name.localeCompare(b.name);
              break;
            case "price":
              comparison = a.price - b.price;
              break;
            case "created":
              // Assuming you have a created date in ISO format
              comparison = new Date(a.created) - new Date(b.created);
              break;
            case "rating":
              comparison = a.rating - b.rating;
              break;
            case "popularity":
              // Assuming you count bookings for popularity
              comparison = a.bookings.length - b.bookings.length;
              break;
            // Add other cases as needed
            default:
              // Handle default case or throw an error
              break;
          }
          // Apply reverse order if isReversed is true
          return state.isReversed ? comparison * -1 : comparison;
        });
      }

      return { filteredVenues: newFilteredVenues }; // return the new state value
    });
  },

  bookVenue: async (bookingData) => {
    try {
      await useFetchStore.getState().apiFetch("bookings", "POST", bookingData);
      useFetchStore
        .getState()
        .setSuccessMsg(`Booking at ${bookingData.name} was successful!`);
    } catch (error) {
      useFetchStore.getState().setErrorMsg(error.message);
    }
  },
  deleteBooking: async (id, name) => {
    try {
      await useFetchStore.getState().apiFetch(`bookings/${id}`, "DELETE");
      // After deletion, remove the venue from the local state to reflect the change??
      //name should be capitalized
      useFetchStore
        .getState()
        .setSuccessMsg(`Successfully deleted booking at ${name}`);
    } catch (error) {
      useFetchStore.getState().setErrorMsg(error.message);
    }
  },
}));

export const useGalleryStore = create((set) => ({
  openImageIndex: null,
  setOpenImageIndex: (index) => set({ openImageIndex: index }),
  goToNextImage: (mediaLength) =>
    set((state) => {
      // If the current index is less than the length of the media array, increment it by 1
      const newIndex =
        state.openImageIndex < mediaLength - 1 ? state.openImageIndex + 1 : 0;
      return { openImageIndex: newIndex };
    }),
  goToPreviousImage: (mediaLength) =>
    set((state) => {
      const newIndex =
        // If the current index is greater than 0, decrement it by 1
        state.openImageIndex > 0 ? state.openImageIndex - 1 : mediaLength - 1;
      return { openImageIndex: newIndex };
    }),
}));

// Profiles store for fetching profiles and selected profile
export const useProfileStore = create((set) => ({
  profiles: [],
  selectedProfile: null,
  clearSelectedProfile: () => set({ selectedProfile: null }),

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

export const useDialogStore = create((set) => ({
  isOpen: false,
  title: "",
  description: "",
  details: "",
  onConfirm: () => {},
  openDialog: (title, description, details, onConfirm) =>
    set({ isOpen: true, title, description, details, onConfirm }),
  closeDialog: () =>
    set({
      isOpen: false,
      title: "",
      description: "",
      details: "",
      onConfirm: () => {},
    }),
}));
