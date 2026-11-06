import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter, assertLoadMoreButtonWorks } from '../helpers.js';
import { setupGuestTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Guest - Tag page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupGuestTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("sidebar").getByText("Excepturi Corporis").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h2").first()).toContainText("Excepturi Corporis");
  });

  describeNavbar('guest');

  test.describe('main', () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main")).toContainText("Altenwerth Ford");

      await assertLoadMoreButtonWorks(page, helpers, [
        "Parker Landing",
        "Toni Pine",
        "Zulauf Roads",
      ]);
    });
  });

  describeSidebar('guest');
  describeFooter('guest');
});
