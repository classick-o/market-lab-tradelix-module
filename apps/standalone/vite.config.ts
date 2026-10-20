import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Sub-path the app is served from. "/" locally; set by the GitHub Pages workflow (e.g. "/repo-name/").
  base: process.env.PAGES_BASE ?? "/",
  plugins: [react()],
  server: { port: 5180, open: false },
  preview: { port: 5180 },
});
