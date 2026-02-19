import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter, assertLoadMoreButtonWorks } from '../helpers.js';
import { setupAdminTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Admin - Tag page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupAdminTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("sidebar").getByText("Excepturi Corporis").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h2").first()).toContainText("Excepturi Corporis");
  });

  describeNavbar('admin');

  test.describe('main', () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main")).toContainText("Altenwerth Ford");

      await assertLoadMoreButtonWorks(page, helpers, [
        "Parker Landing",
        "Toni Pine",
        "Zulauf Roads",
      ]);
    });

    test.describe("meta", () => {
      test(`should have an interface to allow the user to edit the meta title`, async ({ page, helpers }) => {
        await expect(page).toHaveTitle(/Excepturi Corporis/);
        await expect(page.getByTestId("main").getByTestId("tag-meta")).not.toContainText("Meta title: Excepturi Corporis");
        await expect(page).not.toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("tag-meta")).not.toContainText("Meta title: Apple pear");

        await page.getByTestId("main").getByTestId("edit-tag-meta").click();
        await helpers.submitForm({ metaTitle: "Apple pear" });

        await expect(page).toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("tag-meta")).toContainText("Meta title: Apple pear");
        await expect(page).not.toHaveTitle(/Excepturi Corporis/);
      });

      test(`should have an interface to allow the user to edit the meta description`, async ({ page, helpers }) => {
        await expect(page.locator('head meta[name="description"]')).not.toBeAttached();
        await expect(page.getByTestId("main").getByTestId("tag-meta")).not.toContainText("Meta description: Apple plum");

        await page.getByTestId("main").getByTestId("edit-tag-meta").click();
        await helpers.submitForm({ metaDescription: "Apple plum" });

        await expect(page.locator('head meta[name="description"]')).toHaveAttribute("content", "Apple plum");
        await expect(page.getByTestId("main").getByTestId("tag-meta")).toContainText("Meta description: Apple plum");
      });

      test(`should have an interface to allow the user to edit the name`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("tag-meta")).toContainText("Name: Excepturi Corporis");

        await page.getByTestId("main").getByTestId("edit-tag-meta").click();
        await helpers.submitForm({ name: "Foo bar" });
        await expect(page.getByTestId("main").getByTestId("tag-meta")).toContainText("Name: Foo bar");

        await page.getByTestId("main").getByTestId("edit-tag-meta").click();
        await helpers.submitForm({ name: "Excepturi Corporis" });
        await expect(page.getByTestId("main").getByTestId("tag-meta")).toContainText("Name: Excepturi Corporis");
      });

      test(`should have an interface to allow the user to edit the slug`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("tag-meta")).toContainText("Slug: excepturi-corporis");
        await expect(page).toHaveURL(/excepturi-corporis/);
        await expect(page.getByTestId("main").getByTestId("tag-meta")).not.toContainText("Slug: foo-bar");
        await expect(page).not.toHaveURL(/foo-bar/);

        await page.getByTestId("main").getByTestId("edit-tag-meta").click();
        await helpers.submitForm({ slug: "foo-bar" });

        await expect(page.getByTestId("main").getByTestId("tag-meta")).not.toContainText("Slug: excepturi-corporis");
        await expect(page).not.toHaveURL(/excepturi-corporis/);
        await expect(page.getByTestId("main").getByTestId("tag-meta")).toContainText("Slug: foo-bar");
        await expect(page).toHaveURL(/foo-bar/);
      });
    });

    test(`should have an interface to allow the user to delete the current tag`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("tag-meta")).toBeVisible();
      await page.getByTestId("main").getByTestId("toggle-danger-area").click();
      await page.getByTestId("main").getByTestId("delete-tag").click();
      await expect(page.getByTestId("main").getByTestId("tag-meta")).not.toBeVisible();
    });
  });

  describeSidebar('admin');
  describeFooter('admin');
});
