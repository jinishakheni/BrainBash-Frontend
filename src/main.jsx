import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import App from "./App.jsx";
import "@mantine/notifications/styles.css";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import "./styles/global.css";
import theme from "./styles/theme.js";

import { BrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { AuthProviderWrapper } from "./contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" autoClose={4000} zIndex={1000} />
      <BrowserRouter>
        <AuthProviderWrapper>
          <App />
        </AuthProviderWrapper>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
