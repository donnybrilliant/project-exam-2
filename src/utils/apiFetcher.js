const BASE_URL = "https://api.noroff.dev/api/v1/holidaze";

// apiFetcher function for fetching data from the API.
// It takes an endpoint, token and options as arguments.
const apiFetcher = async (endpoint, token, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export default apiFetcher;
