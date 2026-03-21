import { test, expect } from '../fixtures.js';

export function setupGuestTests() {
  test.beforeEach(async ({ page, helpers }) => {
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
  });

  test.afterEach(async ({ page, helpers }) => {
    await helpers.waitForPageToBeIdle();
    const isPersistent = await page.evaluate(() => window.isPersistentContext);
    expect(isPersistent).toBe(true);
    await helpers.resetDatabaseFromSql();
  });
}
