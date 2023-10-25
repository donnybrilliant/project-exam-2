import "@fontsource/poppins"; // Import Poppins font
import "@fontsource/outfit"; // Import Outfit font

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
        primary: {
          main: "#ea6659",
        },
      },
      typography: {
        fontFamily: "Outfit, sans-serif",
        h1: {
          fontFamily: "Poppins, sans-serif",
          fontSize: 36,
        },
        h2: {
          fontFamily: "Poppins, sans-serif",
          fontSize: 18,
        },
        h3: {
          fontFamily: "Poppins, sans-serif",
          fontSize: 16,
        },
        h4: {
          fontFamily: "Poppins, sans-serif",
        },
        h5: {
          fontFamily: "Poppins, sans-serif",
        },
        h6: {
          fontFamily: "Poppins, sans-serif",
        },
      },
      components: {
        MuiTypography: {
          styleOverrides: {
            logo: {
              fontFamily: "Poppins, sans-serif",
              fontSize: 18,
            },
            price: {
              fontSize: 22,
            },
          },
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
