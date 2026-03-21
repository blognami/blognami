import { test, expect } from '../fixtures.js';
import { setupAdminTests } from './helpers.js';
import { QUICK } from '../constants.js';

test.describe('Admin - Smoke', () => {
  test.skip(!QUICK, 'Only runs in quick mode');
  setupAdminTests();

  test('quick smoke: add, edit, delete post', async ({ page, helpers }) => {
    // Add post
    await page.getByTestId("navbar").getByTestId("add").click();
    await helpers.topPopover().getByTestId("add-post").click();
    await expect(helpers.topModal()).toContainText("Add post");
    await helpers.submitForm({ title: "Apple pear" });
    await expect(page).toHaveURL(/apple-pear/);

    // Edit title
    await page.getByTestId("main").getByTestId("edit-post-title").click();
    await helpers.submitForm({ title: "Banana split" });
    await expect(page.getByTestId("main").getByTestId("post-title")).toContainText("Banana split");

    // Delete post
    await page.getByTestId("main").getByTestId("toggle-danger-area").click();
    await page.getByTestId("main").getByTestId("delete-post").click();
    await expect(page.getByTestId("main").getByTestId("post-title")).not.toBeVisible();
  });
});
