import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    {
      name: 'pdf-worker-plugin',
      buildStart() {
        // Copy PDF.js worker to public directory during build
        const workerPath = require.resolve('pdfjs-dist/build/pdf.worker.min.js');
        fs.copyFileSync(workerPath, 'public/pdf.worker.min.js');
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'pdfjs-dist/build/pdf.worker.entry'
      ]
    }
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist/build/pdf.worker.entry']
  }
}));