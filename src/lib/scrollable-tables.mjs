/**
 * Wraps every Markdown table in .table-scroll, so a table wider than the
 * column scrolls inside its own box instead of the page scrolling sideways
 * (SC 1.4.10 lets data tables scroll in two dimensions; the page must not).
 *
 * The wrapper is a plain div here. The blog post page makes it a focusable,
 * labelled region only while the table overflows, so keyboard users can
 * scroll it then, and it is not an empty tab stop when the table fits.
 *
 * A Sätteri hast plugin, the Markdown processor Astro uses by default.
 */
export default {
  name: 'scrollable-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'] },
        children: [],
      });
    },
  },
};
