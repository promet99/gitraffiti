import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/gitraffiti/",
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ["buffer"],
      globals: {
        Buffer: true,
      },
      protocolImports: true,
    }),
  ],
});
