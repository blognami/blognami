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

    test(`should support nested reply chains with a reply link on every comment`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await expect(helpers.topModal()).toContainText("Add comment");
      await helpers.submitForm({ email: "bob@example.com", legal: true });
      await helpers.submitForm({ password: "bob@example.com" });
      await helpers.submitForm({ name: "Bob" });
      await helpers.submitForm({ body: "Level 1" });
      await expect(page.getByTestId("main")).toContainText("Level 1");

      for (let level = 2; level <= 4; level++) {
        await page.getByTestId("main").getByTestId("add-comment").getByText("Reply").last().click();
        await helpers.submitForm({ body: `Level ${level}` });
        await expect(page.getByTestId("main")).toContainText(`Level ${level}`);
      }

      await helpers.signOut();
      await helpers.signIn("admin@example.com");
      await page.getByTestId("main").getByTestId("add-comment").getByText("Reply").last().click();
      await helpers.submitForm({ body: "Level 5" });

      for (let level = 1; level <= 5; level++) {
        await expect(page.getByTestId("main")).toContainText(`Level ${level}`);
      }
      await expect(page.getByTestId("main").getByTestId("comment")).toHaveCount(5);
      await expect(page.getByTestId("main").getByTestId("comment").getByTestId("add-comment")).toHaveCount(5);
      await expect(page.getByTestId("main").getByTestId("comment").filter({ hasText: "Level 5" })).toHaveCount(5);

      await expect.poll(async () => {
        const response = await page.request.get("/_test/notifications?email=bob@example.com");
        const { notifications } = await response.json();
        return notifications.join("\n");
      }).toContain("A new comment reply has been added to");
    });

    test(`should cap nesting depth with a continue this thread link to a sub-thread view`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await expect(helpers.topModal()).toContainText("Add comment");
      await helpers.submitForm({ email: "bob@example.com", legal: true });
      await helpers.submitForm({ password: "bob@example.com" });
      await helpers.submitForm({ name: "Bob" });
      await helpers.submitForm({ body: "Level 1" });
      await expect(page.getByTestId("main")).toContainText("Level 1");

      for (let level = 2; level <= 9; level++) {
        await page.getByTestId("main").getByTestId("comment").getByTestId("add-comment").last().click();
        await helpers.submitForm({ body: `Level ${level}` });
      }

      // nesting renders to the cap; the deeper comment is reachable via the continue link
      await expect(page.getByTestId("main").getByTestId("comment")).toHaveCount(8);
      await expect(page.getByTestId("main").getByText("Level 8")).toBeVisible();
      await expect(page.getByTestId("main").getByText("Level 9")).not.toBeVisible();

      await page.getByTestId("main").getByTestId("continue-thread").click();
      await helpers.waitForPageToBeIdle();

      // sub-thread view rooted at the deep comment, indentation restarted
      await expect(page.getByTestId("main").getByText("Level 9")).toBeVisible();
      await expect(page.getByTestId("main").getByTestId("comment")).toHaveCount(1);

      // every comment in the sub-thread has a working reply link
      await page.getByTestId("main").getByTestId("comment").getByTestId("add-comment").last().click();
      await helpers.submitForm({ body: "Level 10" });
      await expect(page.getByTestId("main").getByText("Level 10")).toBeVisible();
      await expect(page.getByTestId("main").getByTestId("comment")).toHaveCount(2);

      // the back link returns to the full discussion
      await page.getByTestId("main").getByTestId("back-to-discussion").click();
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId("main").getByText("Level 1", { exact: true })).toBeVisible();
      await expect(page.getByTestId("main").getByText("Level 9")).not.toBeVisible();

      // at narrow widths the effective cap is shallower and the continue link appears earlier
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(page.getByTestId("main").getByText("Level 4")).toBeVisible();
      await expect(page.getByTestId("main").getByText("Level 5")).not.toBeVisible();

      // indentation and threading lines leave the deepest visible comment readable at 375px
      const deepestComment = page.getByTestId("main").getByTestId("comment").filter({ hasText: "Level 4" }).last();
      expect((await deepestComment.boundingBox()).width).toBeGreaterThan(200);
      await page.getByTestId("main").getByTestId("continue-thread-narrow").click();
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId("main").getByText("Level 5")).toBeVisible();
    });

    test(`should allow collapsing and expanding a comment branch`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await expect(helpers.topModal()).toContainText("Add comment");
      await helpers.submitForm({ email: "bob@example.com", legal: true });
      await helpers.submitForm({ password: "bob@example.com" });
      await helpers.submitForm({ name: "Bob" });
      await helpers.submitForm({ body: "Parent comment" });
      await expect(page.getByTestId("main")).toContainText("Parent comment");

      await page.getByTestId("main").getByTestId("comment").getByTestId("add-comment").last().click();
      await helpers.submitForm({ body: "First reply" });
      await expect(page.getByTestId("main")).toContainText("First reply");

      await page.getByTestId("main").getByTestId("comment").getByTestId("add-comment").last().click();
      await helpers.submitForm({ body: "Second reply" });
      await expect(page.getByTestId("main")).toContainText("Second reply");

      // collapse the top-level branch: one-line summary with author + reply count, children hidden
      await page.getByTestId("main").getByTestId("collapse-comment").first().click();
      await expect(page.getByTestId("main").getByTestId("collapse-summary").first()).toBeVisible();
      await expect(page.getByTestId("main").getByTestId("collapse-summary").first()).toContainText("2 replies");
      await expect(page.getByTestId("main").getByTestId("comment").first()).toContainText("Bob");
      await expect(page.getByTestId("main").getByText("Parent comment")).not.toBeVisible();
      await expect(page.getByTestId("main").getByText("First reply")).not.toBeVisible();
      await expect(page.getByTestId("main").getByText("Second reply")).not.toBeVisible();

      // expand: the subtree is restored
      await page.getByTestId("main").getByTestId("collapse-comment").first().click();
      await expect(page.getByTestId("main").getByTestId("collapse-summary").first()).not.toBeVisible();
      await expect(page.getByTestId("main").getByText("Parent comment")).toBeVisible();
      await expect(page.getByTestId("main").getByText("First reply")).toBeVisible();
      await expect(page.getByTestId("main").getByText("Second reply")).toBeVisible();

      // a nested branch collapses independently
      await page.getByTestId("main").getByTestId("collapse-comment").last().click();
      await expect(page.getByTestId("main").getByTestId("collapse-summary").last()).toContainText("1 reply");
      await expect(page.getByTestId("main").getByText("Parent comment")).toBeVisible();
      await expect(page.getByTestId("main").getByText("First reply")).not.toBeVisible();
      await expect(page.getByTestId("main").getByText("Second reply")).not.toBeVisible();

      await page.getByTestId("main").getByTestId("collapse-comment").last().click();
      await expect(page.getByTestId("main").getByText("First reply")).toBeVisible();
      await expect(page.getByTestId("main").getByText("Second reply")).toBeVisible();
    });

    test(`should incrementally load long comment lists with a load more control`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await expect(helpers.topModal()).toContainText("Add comment");
      await helpers.submitForm({ email: "bob@example.com", legal: true });
      await helpers.submitForm({ password: "bob@example.com" });
      await helpers.submitForm({ name: "Bob" });
      await helpers.topModal().getByText("Cancel").click();

      // seed 45 top-level comments (two full batches of 20 plus a partial one) directly through the add comment action
      const href = await page.getByTestId("main").getByTestId("add-comment").getAttribute("href");
      const formResponse = await page.request.get(href, { headers: { accept: "application/json" } });
      const { values } = await formResponse.json();
      for (let i = 1; i <= 45; i++) {
        const response = await page.request.post(href, { form: { ...values, body: `Comment ${i}` } });
        expect(response.ok()).toBeTruthy();
      }

      await page.reload();
      await helpers.waitForPageToBeIdle();

      // only the first batch renders, with a load more control
      await expect(page.getByTestId("main").getByTestId("comment")).toHaveCount(20);
      await expect(page.getByTestId("main").getByTestId("load-more")).toBeVisible();

      await page.getByTestId("main").getByTestId("load-more").click();
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId("main").getByTestId("comment")).toHaveCount(40);
      await expect(page.getByTestId("main").getByTestId("load-more")).toBeVisible();

      await page.getByTestId("main").getByTestId("load-more").click();
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId("main").getByTestId("comment")).toHaveCount(45);
      await expect(page.getByTestId("main").getByTestId("load-more")).not.toBeVisible();

      // no duplicates and no gaps: every seeded comment renders exactly once
      for (let i = 1; i <= 45; i++) {
        await expect(page.getByTestId("main").getByText(`Comment ${i}`, { exact: true })).toHaveCount(1);
      }
    });

    test(`should show only what is being commented on in the context pane of the markdown editor`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await expect(helpers.topModal()).toContainText("Add comment");
      await helpers.submitForm({ email: "bob@example.com", legal: true });
      await helpers.submitForm({ password: "bob@example.com" });
      await helpers.submitForm({ name: "Bob" });
      await helpers.submitForm({ body: "Parent comment" });
      await expect(page.getByTestId("main")).toContainText("Parent comment");

      await page.getByTestId("main").getByTestId("comment").getByTestId("add-comment").last().click();
      await helpers.submitForm({ body: "Nested comment" });
      await expect(page.getByTestId("main")).toContainText("Nested comment");

      // open the reply overlay on the nested comment and type some draft text
      await page.getByTestId("main").getByTestId("comment").getByTestId("add-comment").last().click();
      await helpers.waitForPageToBeIdle();
      await helpers.topModal().locator('[data-test-id="markdown-input"]').click();
      await helpers.waitForPageToBeIdle();
      await page.keyboard.type("Draft reply");

      // on desktop the context pane is always visible and renders only the comment being replied to
      await expect(helpers.topModal().getByTestId("context-toggle")).not.toBeVisible();
      await expect(helpers.topModal().getByTestId("context-pane")).toContainText("Nested comment");
      await expect(helpers.topModal().getByTestId("context-pane")).not.toContainText("Parent comment");
      await expect(helpers.topModal().getByTestId("context-pane")).not.toContainText("Similique fuga consequatur");
      await expect(helpers.topModal().locator('[data-part="editor-textarea"]')).toHaveValue("Draft reply");

      await helpers.closeTopModal();
      await helpers.topModal().getByText("Cancel").click();

      // repeat for a top-level comment: the context pane renders only the post
      await page.getByTestId("main").getByTestId("add-comment").getByText("Add comment").click();
      await helpers.waitForPageToBeIdle();
      await helpers.topModal().locator('[data-test-id="markdown-input"]').click();
      await helpers.waitForPageToBeIdle();
      await page.keyboard.type("Draft comment");

      await expect(helpers.topModal().getByTestId("context-pane")).toContainText("Similique fuga consequatur");
      await expect(helpers.topModal().getByTestId("context-pane")).not.toContainText("Parent comment");
      await expect(helpers.topModal().getByTestId("context-pane")).not.toContainText("Nested comment");
      await expect(helpers.topModal().locator('[data-part="editor-textarea"]')).toHaveValue("Draft comment");
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
