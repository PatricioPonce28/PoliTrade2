import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'PoliTrade',
        short_name: 'PoliTrade',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          { src: '/iconos_pwa/Logo1-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/iconos_pwa/Logo1-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          { urlPattern: /.*\.(html|js|css|png|jpg|jpeg|svg|webp|avif)/, handler: 'CacheFirst' }
        ]
      }
    }),
    imagetools()
  ]
});
