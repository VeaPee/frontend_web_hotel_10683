import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'json', 'html'], // Choose the reporters you need
      include: ['src/**/*.{ts,tsx,js,jsx}'], // Adjust as needed
      exclude: ['node_modules', 'test/**/*'], // Exclude directories/files
    },
  },
});
