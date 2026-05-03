import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Small JPEGs (e.g. hero banner) default to base64 data URLs, which break under
    // strict CSP (img-src without `data:`) and some static hosts. Always emit files.
    assetsInlineLimit: 0,
  },
});
