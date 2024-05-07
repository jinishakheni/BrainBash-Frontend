import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import App from "./App.jsx";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import "./styles/global.css";
import theme from "./styles/theme.js";

import { AuthProviderWrapper } from "./contexts/AuthContext.jsx";
import { CategoryContextWrapper } from "./contexts/CategoryContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" autoClose={4000} zIndex={1000} />
      <BrowserRouter>
        <AuthProviderWrapper>
          <CategoryContextWrapper>
            <App />
          </CategoryContextWrapper>
        </AuthProviderWrapper>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
