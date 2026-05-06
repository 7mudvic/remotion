import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The web app is deployed at the root path; if hosting on GitHub Pages
  // under a sub-directory, set base: '/<repo-name>/'.
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
