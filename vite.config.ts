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
        birthday: resolve(__dirname, "birthday/index.html"),
        birthdayPrivacy: resolve(__dirname, "birthday/privacy/index.html"),
        birthdaySupport: resolve(__dirname, "birthday/support/index.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
  },
});
