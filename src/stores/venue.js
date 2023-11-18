import { create } from "zustand";
import dayjs from "dayjs";
import { useFetchStore } from "./fetch";
import { useAuthStore } from "./auth";
import { useDialogStore } from "./dialog";

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
  maxPrice: 0,
  maxSliderValue: 500,
  sortType: null,
  isReversed: false,

  // Action for updating the sort type
  updateSortType: (type) => set({ sortType: type }),

  // Action for reversing the filtered venues
  reverseFilteredVenues: () =>
    set((state) => ({
      filteredVenues: [...state.filteredVenues].reverse(),
      isReversed: !state.isReversed,
    })),

  // Action for updating the max price
  setMaxPrice: () => {
    const venues = useVenueStore.getState().venues;
    const calculatedMaxPrice = venues.reduce((max, venue) => {
      return Math.max(max, venue.price);
    }, 0);
    set({ maxPrice: calculatedMaxPrice });
  },

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
    useVenueStore.getState().setMaxPrice();
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

  // Action for sorting and filtering venues
  filterVenues: (
    searchTerm,
    startDate,
    endDate,
    guests,
    sortType,
    amenitiesFilters,
    priceRange,
    minRating
  ) => {
    set((state) => {
      const lowerCaseTerm = searchTerm ? searchTerm.toLowerCase() : "";

      let newFilteredVenues = state.venues.filter((venue) => {
        // Text Search
        const textMatch = [
          venue.name,
          venue.description,
          venue.location.city,
          venue.location.address,
          venue.location.continent,
          venue.location.country,
          venue.location.zip,
        ].some((field) => field && field.toLowerCase().includes(lowerCaseTerm));

        // Date Range Search
        const dateMatch = !venue.bookings.some((booking) => {
          const bookingStart = dayjs(booking.dateFrom);
          const bookingEnd = dayjs(booking.dateTo);
          const searchStart = dayjs(startDate, "DD/MM/YY");
          const searchEnd = dayjs(endDate, "DD/MM/YY");

          // If there is no start and end date, return false
          if (!searchStart && !searchEnd) {
            return false;
          }

          return (
            (searchStart &&
              searchStart.isValid() &&
              searchStart.isBetween(bookingStart, bookingEnd, null, "[]")) ||
            (searchEnd &&
              searchEnd.isValid() &&
              searchEnd.isBetween(bookingStart, bookingEnd, null, "[]"))
          );
        });

        // Guest Count Search
        const guestMatch = venue.maxGuests >= guests;

        return textMatch && dateMatch && guestMatch;
      });

      // Filter by amenities
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
          );
        });
      }

      // Filter by price range
      if (priceRange) {
        newFilteredVenues = newFilteredVenues.filter((venue) => {
          const price = venue.price;
          // If the slider is at max, consider any price up to maxPrice
          const upperBound =
            priceRange[1] === useVenueStore.getState().maxSliderValue
              ? useVenueStore.getState().maxPrice
              : priceRange[1];

          return price >= priceRange[0] && price <= upperBound;
        });
      }

      // Sort the filtered venues
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
            default:
              // Handle default case or throw an error
              break;
          }
          // Apply reverse order if isReversed is true
          return state.isReversed ? comparison * -1 : comparison;
        });
      }

      // Filter by minimum rating
      if (minRating) {
        newFilteredVenues = newFilteredVenues.filter((venue) => {
          return venue.rating >= minRating;
        });
      }

      return { filteredVenues: newFilteredVenues };
    });
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
