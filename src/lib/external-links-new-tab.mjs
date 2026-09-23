/**
 * Opens off-site Markdown links in a new tab, the same as the hand-written
 * off-site links: target="_blank" with rel="noopener" stated rather than
 * left to the browser to imply.
 *
 * Only absolute http(s) links to another host. Relative links stay on the
 * site, and mailto: is left alone — a new tab for it is left empty once
 * the mail client opens.
 *
 * A Sätteri hast plugin, the Markdown processor Astro uses by default.
 */
const SITE_HOSTS = new Set(['www.carmenkrol.com', 'carmenkrol.com']);

export default {
  name: 'external-links-new-tab',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = String(node.properties?.href ?? '');
      let url;
      try {
        url = new URL(href);
      } catch {
        return; // Relative, so on this site.
      }
      if (!/^https?:$/.test(url.protocol) || SITE_HOSTS.has(url.hostname)) {
        return;
      }
      ctx.setProperty(node, 'target', '_blank');
      ctx.setProperty(node, 'rel', ['noopener']);
    },
  },
};
