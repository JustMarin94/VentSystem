import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Add your ngrok host here
    allowedHosts: ["32cbcc8219ea.ngrok-free.app"],
  },
});
