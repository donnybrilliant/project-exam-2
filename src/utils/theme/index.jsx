import { createTheme, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { useThemeStore } from "../../stores";

// This component is used to create a theme based on the color mode
export const useMyTheme = () => {
  const mode = useThemeStore((state) => state.colorMode);

  // Create a theme instance only if the color mode changes
  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        white: {
          main: "#fff",
        },
      },
    });
  }, [mode]);

  return theme;
};

// This component is used to provide the theme to the app
export const ThemeProviderComponent = ({ children }) => {
  const theme = useMyTheme();

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
