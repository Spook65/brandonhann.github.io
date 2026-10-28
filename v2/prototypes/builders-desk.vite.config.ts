import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/brandonhann.github.io/',
  plugins: [react()],
  build: {
    outDir: 'artifacts/w4/prototype-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        portfolio: resolve(__dirname, '../index.html'),
        desk: resolve(__dirname, 'builders-desk.html'),
      },
    },
  },
});
