import { defineConfig } from 'vite';

export default defineConfig({
  // Относительные пути, чтобы проект корректно работал на GitHub Pages
  base: './',
  build: {
    outDir: 'dist',
  },
});
