import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // points to client/src correctly
    },
  },
  server: {
    port: 5173, // or whatever port you want for frontend
  },
});
