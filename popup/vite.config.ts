import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8888,
    // open: "./",
    // hmr: {
    //   host: "localhost",
    // },
    // host: "0.0.0.0",
  },
  build: {
    outDir: path.resolve(__dirname, "../extension-pack/popup"),
  },
  base: "/popup/",
  // optimizeDeps: {
  //   exclude: [
  //     '@fortawesome/fontawesome-free',
  //     '@fortawesome/react-fontawesome',
  //     '@fortawesome/free-solid-svg-icons',
  //     '@fortawesome/fontawesome-svg-core',
  //   ],
  // },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: "@/shared",
        replacement: path.resolve(__dirname, "src/shared"),
      },
      {
        find: "@/models",
        replacement: path.resolve(__dirname, "src/models"),
      },
    ],
  },
});
