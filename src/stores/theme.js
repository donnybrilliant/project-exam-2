import { create } from "zustand";
import { persist } from "zustand/middleware";

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
