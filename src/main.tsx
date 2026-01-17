import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/dark-mode/theme-provider.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-right" expand={false} richColors closeButton />
      <App />
    </ThemeProvider>
  </StrictMode>
);
