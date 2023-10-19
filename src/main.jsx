import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import theme from "./utils/theme";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
