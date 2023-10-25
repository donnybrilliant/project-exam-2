import { useThemeStore } from "../../stores";
import { ListItemIcon, MenuItem } from "@mui/material";
import { DarkMode } from "@mui/icons-material";
import { LightMode } from "@mui/icons-material";

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
