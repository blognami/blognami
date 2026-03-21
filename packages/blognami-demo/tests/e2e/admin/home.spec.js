import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter, assertLoadMoreButtonWorks } from '../helpers.js';
import { setupAdminTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Admin - Home page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupAdminTests();

  describeNavbar('admin');

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

    test.describe("meta", () => {
      test(`should have an interface to allow the user to edit the meta title`, async ({ page, helpers }) => {
        await expect(page).toHaveTitle(/Lorem ipsum/);
        await expect(page.getByTestId("main").getByTestId("home-meta")).not.toContainText("Meta title: Lorem ipsum");
        await expect(page).not.toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("home-meta")).not.toContainText("Meta title: Apple pear");

        await page.getByTestId("main").getByTestId("edit-home-meta").click();
        await helpers.submitForm({ metaTitle: "Apple pear" });

        await expect(page).toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("home-meta")).toContainText("Meta title: Apple pear");
        await expect(page).not.toHaveTitle(/Lorem ipsum/);
      });

      test(`should have an interface to allow the user to edit the meta description`, async ({ page, helpers }) => {
        await expect(page.locator("head meta[name=description]")).not.toBeAttached();
        await expect(page.getByTestId("main").getByTestId("home-meta")).not.toContainText("Meta description: Apple plum");

        await page.getByTestId("main").getByTestId("edit-home-meta").click();
        await helpers.submitForm({ metaDescription: "Apple plum" });

        await expect(page.locator("head meta[name=description]")).toHaveAttribute("content", "Apple plum");
        await expect(page.getByTestId("main").getByTestId("home-meta")).toContainText("Meta description: Apple plum");
      });
    });
  });

  describeSidebar('admin');
  describeFooter('admin');
});
