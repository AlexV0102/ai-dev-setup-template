import { expect, test } from '@playwright/test';

test('a visitor gets a greeting by name using only the keyboard', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your name').fill('Ada');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('status')).toHaveText('Hello, Ada!');
});

test('a failed request shows a retry message and re-enables the button', async ({ page }) => {
  await page.route('**/api/hello*', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Say hello' }).click();

  await expect(page.getByRole('status')).toHaveText('Could not load the greeting. Try again.');
  await expect(page.getByRole('button', { name: 'Say hello' })).toBeEnabled();
});
