import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material";
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const theme = createTheme({
  typography: {
    fontFamily: `Montserrat, sans-serif`
  }
});

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
