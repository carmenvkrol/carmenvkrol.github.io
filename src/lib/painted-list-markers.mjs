/**
 * Gives every Markdown bulleted list the same treatment as the hand-written
 * ones: role="list" plus .bullet-list, which paints the bullet back without
 * exposing it.
 *
 * A real ::marker is announced by VoiceOver — "bullet" — ahead of the item,
 * on top of the "1 of 3" position it reads at the end. role="list" drops the
 * marker (see the reset in global.css) while keeping the list semantics, and
 * .bullet-list paints a dot that assistive technology does not read. Doing
 * this here rather than in each post means a new post cannot forget it.
 *
 * Ordered lists are left alone. Their number is content, and announcing
 * "1." is the expected default.
 *
 * A Sätteri hast plugin, the Markdown processor Astro uses by default.
 */
export default {
  name: 'painted-list-markers',
  element: {
    filter: ['ul'],
    visit(node, ctx) {
      ctx.setProperty(node, 'role', 'list');
      ctx.setProperty(node, 'className', [
        ...(node.properties?.className ?? []),
        'bullet-list',
      ]);
    },
  },
};
