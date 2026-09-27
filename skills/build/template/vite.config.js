import { defineConfig } from 'vite';

export default defineConfig({
  // Media from tools/film.mjs lives in public/media and is copied as-is; raw generations stay in juried/raw.
  build: { target: 'es2022', assetsInlineLimit: 0, chunkSizeWarningLimit: 900 },
  server: { host: true },
});
