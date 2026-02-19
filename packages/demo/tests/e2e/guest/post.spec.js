import { test, expect } from '../fixtures.js';
import { describeNavbar, describeSidebar, describeFooter } from '../helpers.js';
import { setupGuestTests } from './helpers.js';
import { QUICK, POST_TITLES } from '../constants.js';

test.describe('Guest - Post page', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupGuestTests();

  test.beforeEach(async ({ page, helpers }) => {
    await page.getByTestId("main").getByText("Alexandra Burgs").click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("main").getByTestId("post-title")).toContainText("Alexandra Burgs");
  });

  describeNavbar('guest');

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

      await helpers.submitForm({ email: "bob@example.com", legal: true });
      await helpers.submitForm({ password: "bob@example.com" });
      await helpers.submitForm({ name: "Bob" });

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
  });

  describeSidebar('guest');
  describeFooter('guest');
});
