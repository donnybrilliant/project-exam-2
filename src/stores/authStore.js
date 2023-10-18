import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth store for storing token and userInfo persistently
const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      setAuthInfo: (token, userInfo) => {
        set({ token, userInfo });
      },
      clearAuthInfo: () => {
        set({ token: null, userInfo: null });
      },
    }),
    {
      name: "auth_store",
    }
  )
);

export default useAuthStore;
