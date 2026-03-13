
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['@11labs/react'],
  },
  worker: {
    format: 'es',
  },
  esbuild: {
    // Strip console.log and console.debug in production builds
    // Keeps console.warn and console.error for real issues
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
