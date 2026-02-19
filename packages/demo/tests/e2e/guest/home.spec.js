import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter, assertLoadMoreButtonWorks } from '../helpers.js';
import { setupGuestTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Guest - Home page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupGuestTests();

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
