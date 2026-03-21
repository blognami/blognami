import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter } from '../helpers.js';
import { setupAdminTests } from './helpers.js';
import { QUICK, LOGO_PNG, POST_TITLES } from '../constants.js';

test.describe('Admin - Post page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupAdminTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("main").getByText("Alexandra Burgs").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").getByTestId("post-title")).toContainText("Alexandra Burgs");
  });

  describeNavbar('admin');

  test.describe('main', () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main")).toContainText("Similique fuga consequatur");
    });

    test(`should have an interface to allow the user to add/edit/delete comments`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main")).not.toContainText("Apple");
      await expect(page.getByTestId("main")).not.toContainText("Pear");
      await expect(page.getByTestId("main").getByTestId("comment-created-at")).not.toBeVisible();

      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await helpers.topModal().getByText("Cancel").click();
      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await expect(helpers.topModal()).toContainText("Add comment");

      await helpers.submitForm({ body: "Apple" });
      await expect(page.getByTestId("main")).toContainText("Apple");
      await expect(page.getByTestId("main")).not.toContainText("Pear");
      await expect(page.getByTestId("main").getByTestId("comment-created-at")).not.toContainText("Invalid DateTime");

      await page.getByTestId("main").getByTestId("edit-comment").getByText("Edit").click();
      await helpers.submitForm({ body: "Pear" });
      await expect(page.getByTestId("main")).not.toContainText("Apple");
      await expect(page.getByTestId("main")).toContainText("Pear");

      await page.getByTestId("main").getByTestId("delete-comment").getByText("Delete").click();
      await expect(page.getByTestId("main")).not.toContainText("Apple");
      await expect(page.getByTestId("main")).not.toContainText("Pear");
      await expect(page.getByTestId("main").getByTestId("comment-created-at")).not.toBeVisible();
    });

    test(`should have an interface to allow the user to navigate to the previous/next posts`, async ({ page, helpers }) => {
      const postTitles = POST_TITLES.slice(0, 11);

      for (let i = 0; i < postTitles.length; i++) {
        await expect(page.getByTestId("main").getByTestId("post-title")).toContainText(postTitles[i]);
        if (i < postTitles.length - 1) {
          await page.getByTestId("main").getByTestId("previous-post").click();
        }
      }

      postTitles.reverse();

      for (let i = 0; i < postTitles.length; i++) {
        await expect(page.getByTestId("main").getByTestId("post-title")).toContainText(postTitles[i]);
        if (i < postTitles.length - 1) {
          await page.getByTestId("main").getByTestId("next-post").click();
        }
      }
    });

    test(`should have an interface to allow the user to unpublish/publish the post`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("unpublish-post")).toContainText("Unpublish");
      await page.getByTestId("main").getByTestId("unpublish-post").click();

      await expect(page.getByTestId("main").getByTestId("unpublish-post")).not.toBeVisible();
      await expect(page.getByTestId("main").getByTestId("publish-post")).toContainText("Publish");
      await page.getByTestId("main").getByTestId("publish-post").click();

      await helpers.submitForm({ emailSubscribers: true });

      await expect(page.getByTestId("main").getByTestId("publish-post")).not.toBeVisible();
      await expect(page.getByTestId("main").getByTestId("unpublish-post")).toContainText("Unpublish");
    });

    test(`should have an interface to allow the user to edit the title`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("post-title")).not.toContainText("Apple pear");
      await page.getByTestId("main").getByTestId("edit-post-title").click();
      await helpers.submitForm({ title: "Apple pear" });
      await expect(page.getByTestId("main").getByTestId("post-title")).toContainText("Apple pear");
    });

    test(`should have an interface to allow the user to edit the body`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("post-body")).not.toContainText("Pear plum");
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.submitForm({ body: "Pear plum" });
      await expect(page.getByTestId("main").getByTestId("post-body")).toContainText("Pear plum");

      await expect(page.getByTestId("main").getByTestId("post-body")).not.toContainText("Peach plum");
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.submitForm({ body: "Peach plum" });
      await expect(page.getByTestId("main").getByTestId("post-body")).toContainText("Peach plum");

      await expect(page.getByTestId("main").getByTestId("post-body")).not.toContainText("Pear plum");
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().getByTestId("revisions").click();
      await expect(helpers.topModal().locator("tbody > tr")).toHaveCount(2);
      await helpers.topModal().locator("tbody > tr:last-child a").click();
      await helpers.submitForm({});
      await expect(page.getByTestId("main").getByTestId("post-body")).toContainText("Pear plum");

      await expect(page.getByTestId("main").getByTestId("post-body").locator('img[src="/logo-png"]')).not.toBeVisible();
      await page.getByTestId("main").getByTestId("edit-post-body").click();
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
      await expect(page.getByTestId("main").getByTestId("post-body").locator('img[src="/logo-png"]')).toBeVisible();
    });

    test.describe("tags", () => {
      test(`should have an interface to allow the user to edit the tags`, async ({ page, helpers }) => {
        const tagNames = ["Apple", "Pear", "Plum"];

        for (const name of tagNames) {
          await page.getByTestId("navbar").getByTestId("add").click();
          await helpers.topPopover().getByTestId("add-tag").click();
          await expect(helpers.topModal()).toContainText("Add tag");
          await helpers.submitForm({ name });
          await expect(page).toHaveURL(new RegExp(name.toLowerCase()));
          await page.goBack();
          await helpers.waitForPageToBeIdle();
        }

        for (const title of tagNames) {
          await expect(page.getByTestId("sidebar").getByTestId("tags")).not.toContainText(title);
        }

        await expect(page.getByTestId("main").getByTestId("tagable-tags")).toContainText("Tags: none");
        await page.getByTestId("main").getByTestId("edit-tagable-tags").click();

        for (const name of tagNames) {
          await helpers.topModal().getByText(name).click();
          await helpers.waitForPageToBeIdle();
        }

        await helpers.closeTopModal();
        await expect(page.getByTestId("main").getByTestId("tagable-tags")).toContainText('Tags: "Apple", "Pear", "Plum"');

        for (const title of tagNames) {
          await expect(page.getByTestId("sidebar").getByTestId("tags")).toContainText(title);
        }
      });
    });

    test.describe("meta", () => {
      test(`should have an interface to allow the user to edit the meta title`, async ({ page, helpers }) => {
        await expect(page).toHaveTitle(/Alexandra Burgs/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Meta title: Alexandra Burgs");
        await expect(page).not.toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Meta title: Apple pear");

        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ metaTitle: "Apple pear" });

        await expect(page).toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Meta title: Apple pear");
        await expect(page).not.toHaveTitle(/Alexandra Burgs/);
      });

      test(`should have an interface to allow the user to edit the meta description`, async ({ page, helpers }) => {
        await expect(page.locator("head meta[name=description]")).not.toBeAttached();
        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Meta description: Apple plum");

        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ metaDescription: "Apple plum" });

        await expect(page.locator("head meta[name=description]")).toHaveAttribute("content", "Apple plum");
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Meta description: Apple plum");
      });

      test(`should have an interface to allow the user to edit the slug`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Slug: alexandra-burgs");
        await expect(page).toHaveURL(/\/alexandra-burgs/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Slug: foo-bar");
        await expect(page).not.toHaveURL(/\/foo-bar/);

        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ slug: "foo-bar" });

        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Slug: alexandra-burgs");
        await expect(page).not.toHaveURL(/\/alexandra-burgs/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Slug: foo-bar");
        await expect(page).toHaveURL(/\/foo-bar/);
      });

      test(`should have an interface to allow the user to edit the enableComments flag`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Enable comments: true");
        await expect(page.getByTestId("main").getByTestId("add-comment")).toBeVisible();

        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ enableComments: false });
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Enable comments: false");
        await expect(page.getByTestId("main").getByTestId("add-comment")).not.toBeVisible();

        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ enableComments: true });
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Enable comments: true");
        await expect(page.getByTestId("main").getByTestId("add-comment")).toBeVisible();
      });
    });

    test(`should have an interface to allow the user to delete the current post`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("post-title")).toBeVisible();
      await page.getByTestId("main").getByTestId("toggle-danger-area").click();
      await page.getByTestId("main").getByTestId("delete-post").click();
      await expect(page.getByTestId("main").getByTestId("post-title")).not.toBeVisible();
    });
  });

  describeSidebar('admin');
  describeFooter('admin');
});
