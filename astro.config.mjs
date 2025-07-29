// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react'; // ✅ 新增 React 支持

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    mdx(),
    sitemap(),
    react(), // ✅ 加入 React 到 Astro 插件中
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
