import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/01-project-creator-js/main.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import "./main-scss/color.scss"

import { ContextAPIProvider } from "ContextAPI/AppContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextAPIProvider>
      <App />
    </ContextAPIProvider>
  </StrictMode>
);
