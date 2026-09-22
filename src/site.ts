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
  email: 'contact@carmenkrol.com',

  /**
   * Public by design; safe to commit. Replace with your own from
   * web3forms.com.
   */
  web3formsAccessKey: 'e21ef8ab-0703-4be8-bec0-f4f7ccb313be',

  repoUrl: 'https://github.com/carmenvkrol/carmenvkrol.github.io',

  linkedInUrl: 'https://www.linkedin.com/in/carmenvkrol/',

  gitHubUrl: 'https://github.com/carmenvkrol',

  /** Conformance target, quoted verbatim on the accessibility statement. */
  wcagTarget: 'WCAG 2.2 Level AA',

  /**
   * While true, every page carries `noindex, nofollow`.
   *
   * This is the half that is slow to undo. Once a crawler has indexed a
   * page it will keep serving it long after the page changes, so it stays
   * on until there is something worth finding — which means the blog
   * having at least one published post, rather than "Articles coming
   * soon."
   */
  noindex: true,

  /**
   * While true, every page shows the work-in-progress notice.
   *
   * Deliberately separate from `noindex`. The notice is a promise to the
   * reader that the copy is not final; it comes down when the copy is
   * real, which is earlier than the site is worth listing.
   */
  showConstructionNotice: false,
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
