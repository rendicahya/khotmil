import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icon.svg'],
      manifest: {
        name: "Khotmil Qur'an",
        short_name: 'Khotmil',
        description:
          "Aplikasi web pembuat teks pembagian tugas mengaji (khotmil Qur'an) periode berikutnya",
        theme_color: '#c9a24b',
        background_color: '#f4f1ea',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png}'],
      },
    }),
  ],
});
