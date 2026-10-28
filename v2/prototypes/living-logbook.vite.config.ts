import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/brandonhann.github.io/',
  plugins: [react()],
  build: {
    outDir: 'artifacts/w3/prototype-dist',
    emptyOutDir: true,
    rollupOptions: { input: resolve(__dirname, 'living-logbook.html') },
  },
});
