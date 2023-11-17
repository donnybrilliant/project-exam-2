import React from "react";
import ReactDOM from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProviderComponent } from "./utils/theme";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import GoogleMapsLoader from "./utils/GoogleMapsLoader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import App from "./App.jsx";

dayjs.extend(utc);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="utc">
      <ThemeProviderComponent>
        <CssBaseline />
        <BrowserRouter>
          <GoogleMapsLoader>
            <App />
          </GoogleMapsLoader>
        </BrowserRouter>
      </ThemeProviderComponent>
    </LocalizationProvider>
  </React.StrictMode>
);
