import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter } from '../helpers.js';
import { setupAdminTests } from './helpers.js';
import { QUICK, LOGO_PNG } from '../constants.js';

test.describe('Admin - Basic page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupAdminTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("sidebar").getByText("Osinski Extensions").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").locator("h1")).toContainText("Osinski Extensions");
  });

  describeNavbar('admin');

  test.describe('main', () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main")).toContainText("Similique molestias illum");
    });

    test(`should have an interface to allow the user to edit the title`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("page-title")).not.toContainText("Apple pear");
      await page.getByTestId("main").getByTestId("edit-page-title").click();
      await helpers.submitForm({ title: "Apple pear" });
      await expect(page.getByTestId("main").getByTestId("page-title")).toContainText("Apple pear");
    });

    test(`should have an interface to allow the user to edit the body`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("page-body")).not.toContainText("Pear plum");
      await page.getByTestId("main").getByTestId("edit-page-body").click();
      await helpers.submitForm({ body: "Pear plum" });
      await expect(page.getByTestId("main").getByTestId("page-body")).toContainText("Pear plum");

      await expect(page.getByTestId("main").getByTestId("page-body")).not.toContainText("Peach plum");
      await page.getByTestId("main").getByTestId("edit-page-body").click();
      await helpers.submitForm({ body: "Peach plum" });
      await expect(page.getByTestId("main").getByTestId("page-body")).toContainText("Peach plum");

      await expect(page.getByTestId("main").getByTestId("page-body")).not.toContainText("Pear plum");
      await page.getByTestId("main").getByTestId("edit-page-body").click();
      await helpers.topModal().getByTestId("revisions").click();
      await expect(helpers.topModal().locator("tbody > tr")).toHaveCount(2);
      await helpers.topModal().locator("tbody > tr:last-child a").click();
      await helpers.submitForm({});
      await expect(page.getByTestId("main").getByTestId("page-body")).toContainText("Pear plum");

      await expect(page.getByTestId("main").getByTestId("page-body").locator('img[src="/logo-png"]')).not.toBeVisible();
      await page.getByTestId("main").getByTestId("edit-page-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type('/image');
      await helpers.waitForPageToBeIdle();
      await helpers.topModal().getByText("Add Image").click();
      await helpers.topModal().locator('input[type="file"][name="file"]').setInputFiles(LOGO_PNG);
      await helpers.topModal().locator('button[type="submit"]').click();
      await helpers.waitForPageToBeIdle();
      await helpers.closeTopModal();
      await helpers.topModal().locator('button[type="submit"]').click();
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId("main").getByTestId("page-body").locator('img[src="/logo-png"]')).toBeVisible();
    });

    test.describe("meta", () => {
      test(`should have an interface to allow the user to edit the meta title`, async ({ page, helpers }) => {
        await expect(page).toHaveTitle(/Osinski Extensions/);
        await expect(page.getByTestId("main").getByTestId("page-meta")).not.toContainText("Meta title: Osinski Extensions");
        await expect(page).not.toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("page-meta")).not.toContainText("Meta title: Apple pear");

        await page.getByTestId("main").getByTestId("edit-page-meta").click();
        await helpers.submitForm({ metaTitle: "Apple pear" });

        await expect(page).toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("page-meta")).toContainText("Meta title: Apple pear");
        await expect(page).not.toHaveTitle(/Osinski Extensions/);
      });

      test(`should have an interface to allow the user to edit the meta description`, async ({ page, helpers }) => {
        await expect(page.locator("head meta[name=description]")).not.toBeAttached();
        await expect(page.getByTestId("main").getByTestId("page-meta")).not.toContainText("Meta description: Apple plum");

        await page.getByTestId("main").getByTestId("edit-page-meta").click();
        await helpers.submitForm({ metaDescription: "Apple plum" });

        await expect(page.locator("head meta[name=description]")).toHaveAttribute("content", "Apple plum");
        await expect(page.getByTestId("main").getByTestId("page-meta")).toContainText("Meta description: Apple plum");
      });

      test(`should have an interface to allow the user to edit the slug`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("page-meta")).toContainText("Slug: osinski-extensions");
        await expect(page).toHaveURL(/\/osinski-extensions/);
        await expect(page.getByTestId("main").getByTestId("page-meta")).not.toContainText("Slug: foo-bar");
        await expect(page).not.toHaveURL(/\/foo-bar/);

        await page.getByTestId("main").getByTestId("edit-page-meta").click();
        await helpers.submitForm({ slug: "foo-bar" });

        await expect(page.getByTestId("main").getByTestId("page-meta")).not.toContainText("Slug: osinski-extensions");
        await expect(page).not.toHaveURL(/\/osinski-extensions/);
        await expect(page.getByTestId("main").getByTestId("page-meta")).toContainText("Slug: foo-bar");
        await expect(page).toHaveURL(/\/foo-bar/);
      });

      test(`should have an interface to allow the user to edit the published flag`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("page-meta")).toContainText("Published: true");

        await page.getByTestId("main").getByTestId("edit-page-meta").click();
        await helpers.submitForm({ published: false });
        await expect(page.getByTestId("main").getByTestId("page-meta")).toContainText("Published: false");

        await page.getByTestId("main").getByTestId("edit-page-meta").click();
        await helpers.submitForm({ published: true });
        await expect(page.getByTestId("main").getByTestId("page-meta")).toContainText("Published: true");
      });
    });

    test(`should have an interface to allow the user to delete the current page`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("page-title")).toBeVisible();
      await page.getByTestId("main").getByTestId("toggle-danger-area").click();
      await page.getByTestId("main").getByTestId("delete-page").click();
      await expect(page.getByTestId("main").getByTestId("page-title")).not.toBeVisible();
    });
  });

  describeSidebar('admin');
  describeFooter('admin');
});
