import { useVenueStore } from "../../stores";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AutocompleteSearch = ({ localSearchParams, updateLocalSearchParams }) => {
  const { venues } = useVenueStore();
  // ## I should make this a separate function in a separate file and use it on everything, titles and success msg etc.
  // Helper function to capitalize each word in a string
  const capitalize = (str) => {
    str = str.trim(); // Remove leading/trailing whitespace

    // Remove comma at the end if present
    if (str.endsWith(",")) {
      str = str.slice(0, -1);
    }

    return str
      .split(" ") // Split into words
      .map((word) => {
        if (word.startsWith("(") && word.endsWith(")")) {
          // Capitalize word inside parentheses
          return (
            "(" +
            word.charAt(1).toLocaleUpperCase() +
            word.slice(2, -1).toLocaleLowerCase() +
            ")"
          );
        }
        return (
          word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
        ); // Capitalize first letter, rest to lowercase
      })
      .join(" "); // Join words back together
  };

  // Function to filter the options in the Autocomplete component
  const filterOptions = (options, { inputValue }) => {
    const lowerCaseInputValue = inputValue.toLowerCase();

    // Arrays to store cities, countries, and venue names
    const arrays = {
      city: [],
      country: [],
      venue: [],
    };

    // Function to add values to the appropriate arrays while checking for non-blank values
    const addToArrays = (category, value) => {
      if (value && value.trim() !== "" && arrays.hasOwnProperty(category)) {
        const formattedValue = capitalize(value.toLowerCase());
        arrays[category].push(formattedValue);
      }
    };

    const cities = arrays.city;
    const countries = arrays.country;
    const venueNames = arrays.venue;

    // Iterate through the venues and add cities, countries, and venue names to the arrays
    options.forEach((venue) => {
      const { city, country } = venue.location;
      if (city && city.toLowerCase().includes(lowerCaseInputValue)) {
        addToArrays("city", city);
      }
      if (country && country.toLowerCase().includes(lowerCaseInputValue)) {
        addToArrays("country", country);
      }
      if (
        venue.name &&
        venue.name.toLowerCase().includes(lowerCaseInputValue)
      ) {
        addToArrays("venue", venue.name);
      }
    });

    // Sort each array alphabetically
    const sortAlphabetically = (a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase());
    cities.sort(sortAlphabetically);
    countries.sort(sortAlphabetically);
    venueNames.sort(sortAlphabetically);

    // Concatenate the arrays together
    const concatenatedArray = [...cities, ...countries, ...venueNames];

    // Remove duplicate entries
    const uniqueEntriesSet = new Set(concatenatedArray);

    // Convert the Set back to an array and return it
    return Array.from(uniqueEntriesSet);
  };

  return (
    <Autocomplete
      id="autocomplete-search"
      name="searchTerm"
      fullWidth
      freeSolo
      value={localSearchParams.searchTerm || ""}
      options={venues}
      getOptionLabel={(option) => option}
      onInputChange={(event, newInputValue) => {
        updateLocalSearchParams("searchTerm", newInputValue);
      }}
      filterOptions={filterOptions}
      renderInput={(params) => (
        <TextField {...params} label="Search Destination" variant="outlined" />
      )}
      renderOption={(props, option) => (
        <li key={option} {...props}>
          {option}
        </li>
      )}
    />
  );
};

export default AutocompleteSearch;
