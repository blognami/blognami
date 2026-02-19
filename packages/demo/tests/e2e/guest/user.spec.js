import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter, assertLoadMoreButtonWorks } from '../helpers.js';
import { setupGuestTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Guest - User page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupGuestTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("main").getByText("Alexandra Burgs").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h1")).toContainText("Alexandra Burgs");
    await page.getByTestId("main").getByText("Admin").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h2").first()).toContainText("Admin");
  });

  describeNavbar('guest');

  test.describe('main', () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main")).toContainText("Alexandra Burgs");

      await assertLoadMoreButtonWorks(page, helpers, [
        "Ellsworth Squares",
        "Graham Place",
        "Jaskolski Ways",
        "Kris Dale",
        "Lowe Lane",
        "Nicola Circle",
        "Schmeler Garden",
        "Tia Expressway",
        "Wisozk Row",
        "Zulauf Roads",
      ]);
    });
  });

  describeSidebar('guest');
  describeFooter('guest');
});
