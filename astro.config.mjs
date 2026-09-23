// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import paintedListMarkers from './src/lib/painted-list-markers.mjs';

// www is canonical. The apex redirects to it at the DNS/GitHub Pages layer,
// so every absolute URL the build emits — sitemap, RSS, canonical tags —
// must agree on this hostname or you get duplicate-content ambiguity.
export default defineConfig({
  site: 'https://www.carmenkrol.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    // Markdown bulleted lists get role="list" and painted bullets, like
    // every hand-written list, so VoiceOver does not announce "bullet".
    processor: satteri({ hastPlugins: [paintedListMarkers] }),
  },
  build: {
    // Emit /about/index.html rather than /about.html so URLs stay clean
    // without server-side rewriting, which GitHub Pages cannot do.
    format: 'directory',
  },
  // 'jsx' is the v7 default and strips whitespace between inline elements.
  // Keeping whitespace preserved avoids words running together in prose,
  // which is a real reading problem, not a cosmetic one.
  compressHTML: false,
});
