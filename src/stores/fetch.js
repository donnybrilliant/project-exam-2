import { create } from "zustand";
import { BASE_URL } from "../constants";
import { useAuthStore } from "./auth";

// Fetch store for handling API requests

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
