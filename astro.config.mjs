// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ESEMPIO.exoitalia.it',
  // TEMPORANEO: finché non c'è un dominio personalizzato (CNAME), GitHub
  // Pages serve questo repo da <utente>.github.io/ExoItalia/, non dalla
  // radice. Rimuovere "base" (e src/lib/paths.ts smette di servire) non
  // appena il dominio definitivo va in produzione.
  base: '/ExoItalia',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
