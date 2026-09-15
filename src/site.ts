/**
 * Single source of truth for site-wide values that appear in more than one
 * place. Changing the published contact address, for instance, is one edit
 * here rather than a search across templates — which is what makes the
 * "rotate the alias if it gets scraped" plan actually cheap to do.
 */
export const site = {
  name: 'Carmen Krol',
  tagline: 'Accessibility engineering for product teams',
  url: 'https://www.carmenkrol.com',

  /** Published contact address. An alias, not a mailbox — rotate freely. */
  email: 'hello@carmenkrol.com',

  /** Public by design; safe to commit. Replace with your own from web3forms.com. */
  web3formsAccessKey: 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY',

  repoUrl: 'https://github.com/carmenvkrol/carmenvkrol.github.io',

  /** Conformance target, quoted verbatim on the accessibility statement. */
  wcagTarget: 'WCAG 2.2 Level AA',

  /**
   * While true, every page shows the work-in-progress notice AND carries
   * `noindex, nofollow`. Set to false the day the real copy lands — it is
   * the single switch that takes the site from private draft to public.
   *
   * The noindex half matters more than the banner: a search engine that
   * indexes "Placeholder — offer one" will keep serving it long after the
   * page is fixed.
   */
  underConstruction: true,
} as const;

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Blog' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;

/** Consistent date rendering. `dateTime` feeds the <time> element. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
