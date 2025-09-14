import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'sign-up': resolve(__dirname, 'sign-up.html'),
        'sign-in': resolve(__dirname, 'sign-in.html'),
        'verify-email': resolve(__dirname, 'verify-email.html'),
        'signup-success': resolve(__dirname, 'signup-success.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        'upload-logo': resolve(__dirname, 'upload-logo.html'),
      }
    }
  }
}));
