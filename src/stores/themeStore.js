import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth store for storing token and userInfo persistently
const useThemeStore = create(
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

export default useThemeStore;
