import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-helmet-async'],
          animations: ['gsap', '@lottiefiles/dotlottie-react', 'lenis'], 
          ui: ['lucide-react', 'react-icons', 'tippy.js']
        }
      }
    }
  }
});