import { test, expect } from './fixtures.js';

export function describeNavbar(role) {
  test.describe("navbar", () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("navbar").getByTestId("title")).toContainText("Lorem ipsum");
      if (role === "admin") {
        await expect(page.getByTestId("navbar").getByTestId("find")).toContainText("Find");
        await expect(page.getByTestId("navbar").getByTestId("add")).toContainText("Add");
        await expect(page.getByTestId("navbar").getByTestId("settings")).toContainText("Settings");
        await expect(page.getByTestId("navbar").getByTestId("your-account")).toContainText("Admin");
      } else {
        await expect(page.getByTestId("navbar").getByTestId("sign-in")).toContainText("Sign in");
      }
    });

    if (role === "admin") {
      test(`should have an interface to allow the user to add a page`, async ({ page, helpers }) => {
        await page.getByTestId("navbar").getByTestId("add").click();
        await helpers.topPopover().getByTestId("add-page").click();
        await expect(helpers.topModal()).toContainText("Add page");
        await helpers.submitForm({ title: "Apple plum" });
        await expect(page).toHaveURL(/apple-plum/);
      });

      test(`should have an interface to allow the user to add a post`, async ({ page, helpers }) => {
        await page.getByTestId("navbar").getByTestId("add").click();
        await helpers.topPopover().getByTestId("add-post").click();
        await expect(helpers.topModal()).toContainText("Add post");
        await helpers.submitForm({ title: "Apple pear" });
        await expect(page).toHaveURL(/apple-pear/);
      });

      test(`should have an interface to allow the user to add a tag`, async ({ page, helpers }) => {
        await page.getByTestId("navbar").getByTestId("add").click();
        await helpers.topPopover().getByTestId("add-tag").click();
        await expect(helpers.topModal()).toContainText("Add tag");
        await helpers.submitForm({ name: "Apple peach" });
        await expect(page).toHaveURL(/apple-peach/);
      });

      test(`should have an interface to allow the user to add a user`, async ({ page, helpers }) => {
        await page.getByTestId("navbar").getByTestId("add").click();
        await helpers.topPopover().getByTestId("add-user").click();
        await expect(helpers.topModal()).toContainText("Add user");
        await helpers.submitForm({
          name: "Apple Orange",
          email: "apple.orange@example.com",
        });
        await expect(page).toHaveURL(/apple-orange/);
      });

      test(`should have an interface to allow the user to find a post`, async ({ page, helpers }) => {
        await page.getByTestId("navbar").getByTestId("find").click();
        await helpers.topPopover().getByTestId("find-post").click();
        await expect(helpers.topModal()).toContainText("Posts");
        await expect(helpers.topModal()).not.toContainText("Graham Place");
        await helpers.topModal().locator("input").fill("Graham Place");
        await helpers.topModal().getByText("Graham Place").click();
        await expect(page).toHaveURL(/graham-place/);
      });

      test(`should have an interface to allow the user to edit the site settings`, async ({ page, helpers }) => {
        await expect(page.getByTestId("navbar")).toContainText("Lorem ipsum");
        await expect(page.getByTestId("navbar")).not.toContainText("Apple peach");
        await page.getByTestId("navbar").getByTestId("settings").click();
        await helpers.topPopover().getByTestId("edit-site-meta").click();
        await expect(helpers.topModal()).toContainText("Edit site");
        await helpers.submitForm({ title: "Apple peach" });
        await expect(page.getByTestId("navbar")).toContainText("Apple peach");
        await expect(page.getByTestId("navbar")).not.toContainText("Lorem ipsum");
      });
    }
  });
}

export function describeSidebar(role) {
  test.describe("sidebar", () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("sidebar").getByTestId("top")).toContainText("Top");
      await expect(page.getByTestId("sidebar").getByTestId("top")).toContainText("Provident itaque iste.");

      await expect(page.getByTestId("sidebar").getByTestId("tags")).toContainText("Tags");
      const tagTitles = ["Excepturi Corporis", "34 posts"];
      for (const title of tagTitles) {
        await expect(page.getByTestId("sidebar").getByTestId("tags")).toContainText(title);
      }
    });
  });
}

export function describeFooter(role) {
  test.describe(`footer`, () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("footer")).toContainText("Lorem ipsum");
      await expect(page.getByTestId("footer")).toContainText("Powered by Blognami");
    });
  });
}

export async function assertLoadMoreButtonWorks(page, helpers, expectedTitles) {
  for (const expectedTitle of expectedTitles) {
    await page.getByTestId("main").getByTestId("load-more").click();
    await expect(page.getByTestId("main")).toContainText(expectedTitle);
  }

  await expect(page.getByTestId("main").getByTestId("load-more")).not.toBeVisible();
}
