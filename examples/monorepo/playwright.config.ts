import { defineConfig } from '@playwright/test';

// Chrome is the installed Google Chrome. Firefox and WebKit use Playwright's own
// builds: install them once with `npx playwright install firefox webkit`.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'output/playwright/report', open: 'never' }]],
  outputDir: 'output/playwright/artifacts',
  use: { baseURL: 'http://127.0.0.1:4173', screenshot: 'only-on-failure', trace: 'off' },
  projects: [
    { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: [
    { command: 'npm run start -w @example/api', url: 'http://127.0.0.1:3001/api/hello' },
    { command: 'npm run preview -w @example/web', url: 'http://127.0.0.1:4173' },
  ],
});
