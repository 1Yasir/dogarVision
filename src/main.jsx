import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext.jsx"; // 1. AuthProvider import kiya
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider> {/* 2. App ko iske andar wrap kiya */}
        <App />
      </AuthProvider> {/* 3. AuthProvider yahan close kiya */}
    </HelmetProvider>
  </StrictMode>
);