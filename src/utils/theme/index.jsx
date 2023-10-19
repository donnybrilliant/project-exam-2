import { createTheme, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import useThemeStore from "../../stores/themeStore";

export const useMyTheme = () => {
  const mode = useThemeStore((state) => state.colorMode);

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

export const ThemeProviderComponent = ({ children }) => {
  const theme = useMyTheme();

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
