# Replace the site with an Astro build

Not a normal PR — this replaces the repository's contents wholesale, so the diff
is "everything deleted, everything added" rather than something to review line
by line. The useful parts are the CI run attached to it and this record of why
the decisions were made.

## What changes

The repo stops being a distribution directory for built output and becomes the
source. `portfolio-website` (Grunt, Bower, jQuery, LESS) is no longer needed and
should be archived once this merges.

- **Astro 7 + TypeScript**, static output, no client-side framework
- **Hand-written CSS** on a token layer — no utility framework, no component
  library, no purchased theme
- **Blog** as a schema-validated content collection, with RSS and a sitemap
- **Contact form** posting to Web3Forms, working with JavaScript disabled
- **Accessibility statement** at `/accessibility/`
- **CI** that blocks merges on accessibility regressions
- **Deploy** via GitHub Actions; built output is never committed

## Target

WCAG 2.2 Level AA. Verified on every pull request by:

- `astro check` — TypeScript and Astro diagnostics
- `html-validate` against the built HTML
- Playwright + axe-core across every built route, at desktop width and 320px
- Structural assertions: one `h1` per page, no horizontal overflow, skip link
  moves focus, contact form error summary takes focus and preserves input

Automated tooling catches roughly a third of WCAG issues, so this is a floor
rather than a conformance claim. The manual checklist is in the README.

## Deliberate decisions

| Decision                                         | Why                                                                                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `role="list"` on every `<ul>`                    | Safari strips list semantics from `list-style: none` lists, so VoiceOver stops announcing counts. `html-validate`'s `no-redundant-role` is off because of it. |
| No CAPTCHA, ever                                 | reCAPTCHA's image grids are a documented barrier; the audio fallback is worse. Honeypot plus server-side filtering instead.                                   |
| Form works without JavaScript                    | Native POST to Web3Forms, returning to `/contact/success/`. JS upgrades it; it is never required.                                                             |
| Nav button rendered `hidden`, revealed by script | With JS unavailable the full link list stays visible rather than collapsing behind a control that cannot open.                                                |
| No sticky header                                 | The most common cause of failing SC 2.4.11 Focus Not Obscured.                                                                                                |
| Theme follows the OS                             | `color-scheme: light dark`, no toggle. The visitor already set this preference.                                                                               |

## Before merging

**Do not merge until `www.carmenkrol.com` resolves to GitHub Pages.**
`public/CNAME` in this branch contains `www.carmenkrol.com`, so merging switches
the Pages custom domain on deploy. If DNS is not ready, the old domain stops
working and the new one has nothing behind it — no working site at either
address, plus a certificate reprovisioning gap.

Nothing needs to be merged to validate this: CI builds the site on this PR, and
`npm run dev` runs it locally.

Also required:

- [ ] `www.carmenkrol.com` CNAME record pointing at `carmenvkrol.github.io`
- [ ] Apex `A`/`AAAA` records so the bare domain redirects to `www`
- [ ] Web3Forms access key set in `src/site.ts`
- [ ] `contact@carmenkrol.com` receiving, and able to send replies

## After merging

- [ ] Confirm Settings → Pages → Source reads **GitHub Actions**
      (`configure-pages` sets this automatically; worth verifying once)
- [ ] Confirm "Enforce HTTPS" becomes available once the certificate issues
- [ ] Verify the domain under account settings, to prevent takeover
- [ ] Archive `portfolio-website`
- [ ] Replace the placeholder copy — search for `Placeholder`
