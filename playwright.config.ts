import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

// Escape hatch for environments that ship their own Chromium instead of
// letting Playwright download one. Unset everywhere normal, including CI.
const launch = process.env.CHROMIUM_PATH
  ? {
      launchOptions: {
        executablePath: process.env.CHROMIUM_PATH,
        args: ['--no-sandbox'],
      },
    }
  : {};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...launch } },
    // Narrow viewport as its own project rather than a one-off test, so every
    // page gets the whole suite at 320px — SC 1.4.10 Reflow. Chromium rather
    // than a phone device preset, so CI only needs one browser binary.
    {
      name: 'narrow',
      use: {
        ...devices['Desktop Chrome'],
        ...launch,
        viewport: { width: 320, height: 640 },
        isMobile: false,
      },
    },
  ],

  // Tests run against the real built output in dist/, not the dev server —
  // a dev-only pass proves nothing about what actually ships.
  //
  // A plain static server rather than `astro preview`, which backgrounds
  // itself in some environments and so never holds the foreground process
  // Playwright waits on.
  webServer: {
    command: `npx sirv dist --port ${PORT} --single false --quiet`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
