import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProviderComponent } from "./utils/theme";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProviderComponent>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProviderComponent>
  </React.StrictMode>
);
