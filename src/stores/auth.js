import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useFetchStore } from "./fetch";

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
