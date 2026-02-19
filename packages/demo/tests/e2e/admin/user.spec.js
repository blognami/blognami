import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter, assertLoadMoreButtonWorks } from '../helpers.js';
import { setupAdminTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Admin - User page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupAdminTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("main").getByText("Alexandra Burgs").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h1")).toContainText("Alexandra Burgs");
    await page.getByTestId("main").getByText("Admin").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h2").first()).toContainText("Admin");
  });

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
      test(`should have an interface to allow the user to edit the name`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("user-meta")).toContainText("Name: Admin");

        await page.getByTestId("main").getByTestId("edit-user-meta").click();
        await helpers.submitForm({ name: "Foo bar" });
        await expect(page.getByTestId("main").getByTestId("user-meta")).toContainText("Name: Foo bar");

        await page.getByTestId("main").getByTestId("edit-user-meta").click();
        await helpers.submitForm({ name: "Admin" });
        await expect(page.getByTestId("main").getByTestId("user-meta")).toContainText("Name: Admin");
      });

      test(`should have an interface to allow the user to edit the meta title`, async ({ page, helpers }) => {
        await expect(page).toHaveTitle(/Admin/);
        await expect(page.getByTestId("main").getByTestId("user-meta")).not.toContainText("Meta title: Admin");
        await expect(page).not.toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("user-meta")).not.toContainText("Meta title: Apple pear");

        await page.getByTestId("main").getByTestId("edit-user-meta").click();
        await helpers.submitForm({ metaTitle: "Apple pear" });

        await expect(page).toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("user-meta")).toContainText("Meta title: Apple pear");
        await expect(page).not.toHaveTitle(/Admin/);
      });

      test(`should have an interface to allow the user to edit the meta description`, async ({ page, helpers }) => {
        await expect(page.locator('head meta[name="description"]')).not.toBeAttached();
        await expect(page.getByTestId("main").getByTestId("user-meta")).not.toContainText("Meta description: Apple plum");

        await page.getByTestId("main").getByTestId("edit-user-meta").click();
        await helpers.submitForm({ metaDescription: "Apple plum" });

        await expect(page.locator('head meta[name="description"]')).toHaveAttribute("content", "Apple plum");
        await expect(page.getByTestId("main").getByTestId("user-meta")).toContainText("Meta description: Apple plum");
      });

      test(`should have an interface to allow the user to edit the slug`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("user-meta")).toContainText("Slug: admin");
        await expect(page).toHaveURL(/\/admin/);
        await expect(page.getByTestId("main").getByTestId("user-meta")).not.toContainText("Slug: foo-bar");
        await expect(page).not.toHaveURL(/foo-bar/);

        await page.getByTestId("main").getByTestId("edit-user-meta").click();
        await helpers.submitForm({ slug: "foo-bar" });

        await expect(page.getByTestId("main").getByTestId("user-meta")).not.toContainText("Slug: admin");
        await expect(page).not.toHaveURL(/\/admin/);
        await expect(page.getByTestId("main").getByTestId("user-meta")).toContainText("Slug: foo-bar");
        await expect(page).toHaveURL(/foo-bar/);
      });
    });

    test(`should have an interface to allow the user to delete the current user - but a user can't delete themself`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("user-meta")).toBeVisible();
      await page.getByTestId("main").getByTestId("toggle-danger-area").click();
      await page.getByTestId("main").getByTestId("delete-user").click();

      await expect(helpers.topModal()).toContainText("Access denied");
      await expect(helpers.topModal()).toContainText("You can't delete your own account - another admin must do this for you.");
      await helpers.topModal().getByText("OK").click();
      await expect(page.getByTestId("main").getByTestId("user-meta")).toBeVisible();

      await page.getByTestId("navbar").getByTestId("add").click();
      await helpers.topPopover().getByTestId("add-user").click();
      await expect(helpers.topModal()).toContainText("Add user");
      await helpers.submitForm({
        name: "Apple Orange",
        email: "apple.orange@example.com",
      });
      await expect(page).toHaveURL(/apple-orange/);
      await expect(page.getByTestId("main").getByTestId("user-meta")).toBeVisible();
      await page.getByTestId("main").getByTestId("toggle-danger-area").click();
      await page.getByTestId("main").getByTestId("delete-user").click();
      await expect(page.getByTestId("main").getByTestId("user-meta")).not.toBeVisible();
    });
  });

  describeSidebar('admin');
  describeFooter('admin');
});
