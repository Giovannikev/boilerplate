import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png"],
      manifest: {
        name: "Boilerplate",
        short_name: "Boilerplate",
        description: "Boilerplate supabase - docker - i18n - dark mode",
        theme_color: "#000000",
        icons: [
          {
            src: "logo.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      injectRegister: "auto",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
