import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));

/**
 * Every route the build produced, derived from the output directory rather
 * than from a hand-maintained list — so a new page is covered the moment it
 * exists, and nobody has to remember to add it here.
 */
function routes(dir: string = DIST): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...routes(full));
    } else if (entry === 'index.html') {
      const rel = relative(DIST, dir).split(sep).join('/');
      found.push(rel === '' ? '/' : `/${rel}/`);
    }
  }
  return found.sort();
}

const ALL_ROUTES = routes();

test('the build produced pages to test', () => {
  expect(ALL_ROUTES.length).toBeGreaterThan(0);
});

test.describe('axe-core', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} has no detectable violations`, async ({ page }) => {
      await page.goto(route);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      // Printing the rule and the offending node makes a CI failure
      // actionable without downloading an artifact.
      expect(
        results.violations.map((v) => ({
          rule: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.map((n) => n.html),
        })),
      ).toEqual([]);
    });
  }
});

test.describe('structure', () => {
  for (const route of ALL_ROUTES) {
    test(`${route} has exactly one h1 and a unique title`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/\S/);
    });
  }

  test('no page scrolls horizontally at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const route of ALL_ROUTES) {
      await page.goto(route);
      const overflows = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      );
      expect(overflows, `${route} overflows horizontally at 320px`).toBe(false);
    }
  });
});

test.describe('keyboard', () => {
  test('the skip link is first and moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('every interactive control is reachable and shows focus', async ({
    page,
  }) => {
    await page.goto('/contact/');
    const controls = page.locator(
      [
        'a[href]',
        'button:not([hidden])',
        'input:not([type="hidden"])',
        'textarea',
        'select',
      ].join(', '),
    );
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const control = controls.nth(i);
      if (!(await control.isVisible())) continue;
      await control.focus();
      await expect(control).toBeFocused();
    }
  });
});

test.describe('contact form', () => {
  test('submitting empty shows a summary that takes focus', async ({
    page,
  }) => {
    await page.goto('/contact/');
    await page.getByRole('button', { name: 'Send message' }).click();

    const summary = page.locator('#form-errors');
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary.getByRole('listitem')).toHaveCount(3);

    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  });

  test('an error summary link moves focus to its field', async ({ page }) => {
    await page.goto('/contact/');
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.getByRole('link', { name: 'Enter your email address' }).click();
    await expect(page.locator('#email')).toBeFocused();
  });

  test('values survive a failed submit', async ({ page }) => {
    await page.goto('/contact/');
    await page.locator('#name').fill('Test Person');
    await page.getByRole('button', { name: 'Send message' }).click();
    // SC 3.3.7 Redundant Entry — nothing typed is thrown away.
    await expect(page.locator('#name')).toHaveValue('Test Person');
  });

  test('fixing a field clears its error on blur', async ({ page }) => {
    await page.goto('/contact/');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('#name-error')).toBeVisible();

    await page.locator('#name').fill('Test Person');
    await page.locator('#name').blur();
    await expect(page.locator('#name-error')).toBeHidden();
    await expect(page.locator('#name')).not.toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
