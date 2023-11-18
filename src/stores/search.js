import { create } from "zustand";
import dayjs from "dayjs";

export const useSearchStore = create((set) => ({
  filteredVenues: [],
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

  // Action for setting venues and max price
  setVenuesAndMaxPrice: (venues) => {
    const calculatedMaxPrice = venues.reduce((max, venue) => {
      return Math.max(max, venue.price);
    }, 0);
    set({ filteredVenues: venues, maxPrice: calculatedMaxPrice });
  },

  // Action for updating search params
  updateStoreSearchParams: (newSearchParams) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...newSearchParams },
    })),

  // Action for updating the sort type
  updateSortType: (type) => set({ sortType: type }),

  // Action for reversing the filtered venues
  reverseFilteredVenues: () =>
    set((state) => ({
      filteredVenues: [...state.filteredVenues].reverse(),
      isReversed: !state.isReversed,
    })),

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

      let newFilteredVenues = state.filteredVenues.filter((venue) => {
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
            priceRange[1] === state.maxSliderValue
              ? state.maxPrice
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
}));
