import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Determine backend and frontend URLs based on environment
const isProduction = process.env.NODE_ENV === 'production';
const backendUrl = isProduction
  ? 'https://backendforshop.onrender.com'
  : 'http://localhost:5001';
const frontendUrl = isProduction
  ? 'https://www.nisargmaitri.in'
  : 'http://localhost:5173'; // Default Vite port

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: isProduction, // Enable HTTPS for production
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error for /api:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`Proxying ${req.method} ${req.url} to ${backendUrl}`);
          });
        },
      },
      // Proxy upload requests to the backend
      '/Uploads': {
        target: backendUrl,
        changeOrigin: true,
        secure: isProduction,
        rewrite: (path) => path.replace(/^\/Uploads/, '/Uploads'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error for /Uploads:', err.message);
          });
        },
      },
      // Proxy payment-callback to the frontend (handled by React Router)
      '/payment-callback': {
        target: frontendUrl,
        changeOrigin: true,
        secure: isProduction,
        rewrite: (path) => path.replace(/^\/payment-callback/, '/payment-callback'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.error('Proxy error for /payment-callback:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`Proxying ${req.method} ${req.url} to ${frontendUrl}`);
          });
        },
      },
    },
  },
  // Define environment variables for frontend access
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify(backendUrl),
    'process.env.VITE_FRONTEND_URL': JSON.stringify(frontendUrl),
  },
  // Ensure correct base path for production
  base: isProduction ? '/' : '/',
});