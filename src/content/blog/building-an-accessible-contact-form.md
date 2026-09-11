---
title: 'The contact form is the hardest component on this site'
description: 'Four fields, no CAPTCHA, and a surprising number of ways to get it wrong. What it takes to build a form that works for everyone.'
pubDate: 2026-09-11
tags: ['forms', 'wcag']
draft: true
---

_Draft — placeholder content. Replace with the real post._

A contact form looks like the easy part. Four fields, a button, done. It is
in fact the most demanding component on a site like this, because it is the
only place where something can go wrong for the visitor and they have to
understand why.

## What it has to do

Here is the checklist this site's form is built against:

- Every field has a real `<label>`, visible, never a placeholder standing in
  for one. Placeholders vanish the moment you type.
- `autocomplete` attributes on name, email and organisation, so people using
  autofill — including people for whom typing is effortful — get it.
- On a failed submit, an error summary appears at the top, receives focus,
  and links to each field that needs attention.
- Each field's own message is associated with it through `aria-describedby`,
  alongside `aria-invalid`.
- Nothing typed is ever discarded. WCAG 2.2 added SC 3.3.7 Redundant Entry
  partly for this.
- The submit button is never disabled while sending. A disabled control drops
  out of the accessibility tree; a status region beside it carries the state.
- It works with JavaScript switched off.

## On CAPTCHAs

There isn't one, and there won't be. reCAPTCHA's image grids are hostile to
low-vision and cognitively disabled users, and its audio fallback is worse.
A honeypot field and server-side filtering handle the spam without asking
disabled visitors to prove they are people.

## What I would still change

_Placeholder — the honest section. What is still imperfect about it._
