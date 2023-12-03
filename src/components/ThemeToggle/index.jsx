import { useThemeStore } from "../../stores";
import { ListItemIcon, MenuItem } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

// This component is used to display a theme toggle
const ThemeToggle = () => {
  const toggleColorMode = useThemeStore((state) => state.toggleColorMode);
  const colorMode = useThemeStore((state) => state.colorMode);
  return (
    <MenuItem onClick={toggleColorMode} aria-label="change-color-mode">
      <ListItemIcon>
        {colorMode === "light" ? <DarkMode /> : <LightMode />}
      </ListItemIcon>
      {colorMode === "light" ? "Dark mode" : "Light mode"}
    </MenuItem>
  );
};

export default ThemeToggle;
