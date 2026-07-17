import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, "index.html"),
        birthly: resolve(__dirname, "birthly/index.html"),
        birthlyPrivacy: resolve(__dirname, "birthly/privacy/index.html"),
        birthlySupport: resolve(__dirname, "birthly/support/index.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
});
