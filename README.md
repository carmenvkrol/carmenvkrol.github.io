# carmenkrol.com

Personal site for Carmen Krol — accessibility engineering for product teams.

Built with [Astro](https://astro.build), deployed to GitHub Pages. No component
library, no utility CSS framework, no purchased theme: the point of this site is
that the source is part of the work sample.

Target: **WCAG 2.2 Level AA**. Known exceptions are published at
[/accessibility/](https://www.carmenkrol.com/accessibility/).

---

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
```

| Script              | What it does                                |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                  |
| `npm run build`     | Static build into `dist/`                   |
| `npm run preview`   | Serve the built output                      |
| `npm run check`     | Astro + TypeScript diagnostics              |
| `npm run test:html` | HTML validation of the built output         |
| `npm run test:a11y` | axe-core and keyboard tests against `dist/` |
| `npm run verify`    | Build, then both test suites — what CI runs |

Requires Node 22.12 or later.

---

## Before this goes live

1. **Web3Forms access key.** Sign up at [web3forms.com](https://web3forms.com),
   then replace `web3formsAccessKey` in `src/site.ts`. The key is public by
   design and safe to commit. Point submissions at `hello@carmenkrol.com`, not
   at a personal address.
2. **Set up `hello@carmenkrol.com`.** Forwarding alone is not enough — it
   receives but cannot send, so replies would go out from your personal address.
   Either a real mailbox on the domain, or forwarding plus an SMTP relay
   configured in Gmail's "Send mail as".
3. **Replace the placeholder copy.** Search for `Placeholder` and `PLACEHOLDER`.
   The three offers on the home page matter most — see the build plan.
4. **Write the real accessibility statement.** `src/pages/accessibility.astro`
   has the structure; the known-issues table needs real findings from a manual
   pass.
5. **Repository Pages settings.** Settings → Pages → Source: **GitHub Actions**.
   The `CNAME` file in `public/` sets `www.carmenkrol.com` as the custom domain.
6. **DNS.** `www` is canonical: a `CNAME` record for `www` pointing at
   `<username>.github.io`, and GitHub's `A`/`AAAA` records at the apex so the
   bare domain redirects to `www`.
7. **Flip `underConstruction` to `false`** in `src/site.ts` — do this last.
   While it is `true`, every page shows a work-in-progress banner and carries
   `noindex, nofollow`, which keeps the placeholder copy out of search results.
   Leaving it on after launch means nobody ever finds the site; turning it off
   before the copy is real means Google indexes "Placeholder — offer one" and
   serves it for months.

---

## Structure

```
src/
├─ components/      SiteHeader, SiteFooter, ContactForm
├─ content/blog/    Markdown posts, schema-validated at build time
├─ layouts/         BaseLayout — head, landmarks, skip link
├─ pages/           One file per route
├─ styles/
│  ├─ tokens.css    Every colour and scale value, declared once
│  └─ global.css    Reset, base elements, layout, components, utilities
├─ content.config.ts
└─ site.ts          Shared constants: address, access key, nav
tests/a11y.spec.ts  axe-core, structure, keyboard, form behaviour
```

### The token layer

Every colour is declared once in `tokens.css` using `light-dark()`, which
resolves against the used colour scheme. There is no second palette hidden in a
media query to drift out of sync, and no colour that exists in only one theme —
the usual cause of an unreadable dark mode. Measured contrast ratios are
recorded in comments beside each pair.

The type scale is fluid (`clamp()` between a 320px and 1200px viewport), so
there are no breakpoints where text jumps size.

CSS is organised into cascade layers —
`reset, tokens, base, layout, components, utilities` — so specificity stays flat
and later rules don't have to fight earlier ones.

---

## Accessibility decisions worth knowing about

These are deliberate. If you change them, change them knowingly.

**`role="list"` on every `<ul>`.** Redundant per spec, and `html-validate`'s
`no-redundant-role` rule is switched off because of it. Safari strips list
semantics from any list styled `list-style: none`, so VoiceOver stops announcing
item counts. The explicit role restores it.

**No CAPTCHA on the contact form, and there will not be one.** reCAPTCHA's image
grids are a documented barrier for low-vision and cognitively disabled users,
and the audio fallback is worse. Spam is handled by the honeypot field plus
Web3Forms' server-side filtering, with a client-side timing check that no person
completing four fields could trip.

**The contact form works with JavaScript disabled.** It is a native `<form>`
that POSTs to Web3Forms and returns to `/contact/success/`. JavaScript upgrades
it to in-place validation and background submission; it is never required.

**The navigation button is rendered `hidden` and revealed by script.** With
JavaScript unavailable the full list of links stays visible rather than being
collapsed behind a control that cannot open.

**No sticky header.** Sticky headers are the most common cause of failing SC
2.4.11 Focus Not Obscured, and this site does not need one.

**Theme follows the operating system.** `color-scheme: light dark` with no
toggle. A toggle is a reasonable future addition, but the OS preference is the
one the visitor already set.

---

## CI

`.github/workflows/ci.yml` runs on every pull request:

- `astro check` — TypeScript and Astro diagnostics
- `astro build`
- `html-validate` against the built HTML
- Playwright + axe-core against every built route, at desktop width and at 320px

A failure blocks the merge. `.github/workflows/deploy.yml` builds and deploys to
GitHub Pages on push to `main`; built output is never committed.

### What CI does not catch

**Automated tooling finds roughly a third of WCAG issues.** A green pipeline is
a floor, not a conformance claim. Before each release, do a manual pass:

- Keyboard only, every page, every control
- VoiceOver on macOS and iOS
- NVDA on Windows
- 400% browser zoom
- Windows High Contrast / `forced-colors` mode
- Reduced-motion preference enabled

---

## Next component to build

The scaffold deliberately stops short of one thing: a genuinely hard interactive
component, hand-built and documented — a combobox following the ARIA Authoring
Practices Guide, or a dialog with real focus management and an inert background.
Nobody builds an accessible combobox by accident, which is exactly why it is
worth having one in the repository with tests for its keyboard model.
