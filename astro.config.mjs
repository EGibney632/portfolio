import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';
import rehypeMermaid from 'rehype-mermaid';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// Detect environment
const isProduction = process.env.NODE_ENV === 'production';

// Use 'pre-built' on production (Cloudflare), 'inline-svg' locally
const mermaidStrategy = isProduction ? 'pre-mermaid' : 'inline-svg';
console.log(`Using Mermaid strategy: ${mermaidStrategy}`);

export default defineConfig({
  site: 'https://eliasgibney.com',

  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [
        [
          rehypeMermaid,
          {
            strategy: mermaidStrategy,
          },
        ],
      ],
      syntaxHighlight: {
        type: 'shiki',
        excludeLangs: ['mermaid'],
      },
    }),
    sitemap(), // ✅ Added here
  ],

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
