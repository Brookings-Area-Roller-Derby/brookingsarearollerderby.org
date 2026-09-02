// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://brookingsarearollerderby.org',
  integrations: [sitemap()],
  image: {
    domains: [
      'photos.smugmug.com',
      'lh3.googleusercontent.com',
      'drive.google.com',
      'i.imgur.com',
      'imgur.com',
      'res.cloudinary.com',
      'dl.dropboxusercontent.com',
    ],
    remotePatterns: [{ protocol: 'https' }],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
