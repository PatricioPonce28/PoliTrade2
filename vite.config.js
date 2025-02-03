import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'PoliTrade',
        short_name: 'PoliTrade',
        description: 'Aplicación PoliTrade',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i, // Ahora también incluye webp

            handler: 'CacheFirst', // Caching strategy
            options: {
              cacheName: 'image-cache', // Cache name for images
              expiration: {
                maxEntries: 200, // Maximum number of cached images
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
