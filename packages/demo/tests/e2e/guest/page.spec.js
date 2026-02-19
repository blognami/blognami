import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter } from '../helpers.js';
import { setupGuestTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Guest - Basic page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupGuestTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("sidebar").getByText("Osinski Extensions").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h1")).toContainText("Osinski Extensions");
  });

  describeNavbar('guest');

  test.describe('main', () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main")).toContainText("Similique molestias illum");
    });
  });

  describeSidebar('guest');
  describeFooter('guest');
});
