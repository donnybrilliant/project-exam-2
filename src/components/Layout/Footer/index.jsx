import { Toolbar, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import useThemeStore from "../../../stores/themeStore";
import { DarkMode } from "@mui/icons-material";
import { LightMode } from "@mui/icons-material";

const Footer = () => {
  const toggleColorMode = useThemeStore((state) => state.toggleColorMode);
  const colorMode = useThemeStore((state) => state.colorMode);

  return (
    <Toolbar sx={{ marginTop: 4, justifyContent: "space-between" }}>
      <Typography>Footer</Typography>

      <IconButton onClick={toggleColorMode} aria-label="change-color-mode">
        {colorMode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Toolbar>
  );
};

export default Footer;
