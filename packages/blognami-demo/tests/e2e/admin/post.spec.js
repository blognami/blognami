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

    test(`should open a sign-in overlay above the editor without losing content when the session expires on Save Changes`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type('Session expired draft');
      await helpers.waitForPageToBeIdle();

      const saveButton = helpers.topModal().locator('[data-part="save-changes-button"]');
      await expect(saveButton).toBeVisible();

      await page.context().clearCookies();
      await saveButton.click();
      await helpers.waitForPageToBeIdle();

      // Layer 3: the dropped auth redirect routes to inline re-auth — a sign-in
      // overlay opens stacked above the still-open editor (rather than a phantom
      // success), with the edit held intact underneath and no failure surfaced.
      await expect(helpers.topModal().locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('textarea[name="value"]')).toHaveValue('Session expired draft');
      await expect(page.getByTestId('save-error')).not.toBeVisible();
    });

    test(`should re-authenticate inline and resubmit the held edit when the session expires on Save Changes`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const draftText = 'Re-authenticated body edit';
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type(draftText);
      await helpers.waitForPageToBeIdle();

      const saveButton = helpers.topModal().locator('[data-part="save-changes-button"]');
      await expect(saveButton).toBeVisible();

      // Expire the session, then save: the dropped auth redirect opens a sign-in
      // overlay stacked above the still-open editor.
      await page.context().clearCookies();
      await saveButton.click();
      await helpers.waitForPageToBeIdle();

      await expect(helpers.topModal().locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('textarea[name="value"]')).toHaveValue(draftText);

      // Complete the OTP sign-in in the overlay.
      await helpers.submitForm({ email: "admin@example.com", legal: true });
      await helpers.submitForm({ password: "admin@example.com" });
      await helpers.waitForPageToBeIdle();

      // The overlay closes and the held edit is resubmitted (not retyped): the
      // Save Changes button clears and no failure is shown.
      await expect(page.locator('input[name="email"]')).toHaveCount(0);
      await expect(page.locator('[data-part="save-changes-button"]')).toBeHidden();
      await expect(page.getByTestId('save-error')).not.toBeVisible();

      // The resubmitted save persisted: a reload shows the new body.
      await page.reload();
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId("main").getByTestId("post-body")).toContainText(draftText);
    });

    test(`should autosave the editor content to localStorage and clear it on a successful save`, async ({ page, helpers }) => {
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();

      const editor = helpers.topModal();
      const valueTextarea = editor.locator('textarea[name="value"]');
      await valueTextarea.waitFor();

      const baseline = await valueTextarea.inputValue();
      const draftText = 'Autosaved draft body';

      await valueTextarea.click();
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type(draftText);
      await helpers.waitForPageToBeIdle();

      const readDrafts = () => page.evaluate(() =>
        Object.keys(window.localStorage)
          .filter(key => key.startsWith('markdown-editor-draft:'))
          .map(key => ({ key, ...JSON.parse(window.localStorage.getItem(key)) }))
      );

      // The write is debounced (~500ms) on input.
      await expect.poll(async () => (await readDrafts()).length).toBe(1);

      const [draft] = await readDrafts();
      expect(draft.value).toBe(draftText);
      expect(draft.baseline).toBe(baseline);
      expect(typeof draft.savedAt).toBe('number');

      // A confirmed successful save clears the draft.
      await editor.locator('[data-part="save-changes-button"]').click();
      await helpers.waitForPageToBeIdle();

      await expect.poll(async () => (await readDrafts()).length).toBe(0);
    });

    test(`should restore an autosaved draft on reopen and let the user discard it`, async ({ page, helpers }) => {
      const readDrafts = () => page.evaluate(() =>
        Object.keys(window.localStorage)
          .filter(key => key.startsWith('markdown-editor-draft:'))
          .map(key => ({ key, ...JSON.parse(window.localStorage.getItem(key)) }))
      );

      // Open the post-body editor and capture the server value.
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const baseline = await helpers.topModal().locator('textarea[name="value"]').inputValue();
      const draftText = 'Draft body to be restored';

      // Type an edit to create a draft, then wait for the debounced write.
      await helpers.topModal().locator('textarea[name="value"]').click();
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type(draftText);
      await helpers.waitForPageToBeIdle();
      await expect.poll(async () => (await readDrafts()).length).toBe(1);

      // Abandon the edit without saving. A reload models the crash/navigation the
      // draft is meant to survive: the in-memory editor content (and the cached
      // edit frame) is gone, but the localStorage draft persists.
      await page.reload();
      await helpers.waitForPageToBeIdle();

      // Reopen the post-body editor: the draft is restored behind a banner.
      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const editor = helpers.topModal();
      await expect(editor.getByTestId('restore-banner')).toBeVisible();
      await expect(editor.locator('textarea[name="value"]')).toHaveValue(draftText);
      // The restored draft is unsaved content, so Save Changes is offered immediately.
      await expect(editor.locator('[data-part="save-changes-button"]')).toBeVisible();

      // Discard reverts the editor to the server value, evicts the draft, and
      // leaves nothing to save.
      await editor.getByTestId('discard-draft').click();
      await helpers.waitForPageToBeIdle();
      await expect(editor.locator('textarea[name="value"]')).toHaveValue(baseline);
      await expect(editor.getByTestId('restore-banner')).not.toBeVisible();
      await expect(editor.locator('[data-part="save-changes-button"]')).toBeHidden();
      await expect.poll(async () => (await readDrafts()).length).toBe(0);
    });

    test(`should hide the restore banner once the user starts editing`, async ({ page, helpers }) => {
      const readDrafts = () => page.evaluate(() =>
        Object.keys(window.localStorage)
          .filter(key => key.startsWith('markdown-editor-draft:'))
          .map(key => ({ key, ...JSON.parse(window.localStorage.getItem(key)) }))
      );

      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const draftText = 'Draft body kept by editing';
      await helpers.topModal().locator('textarea[name="value"]').click();
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type(draftText);
      await helpers.waitForPageToBeIdle();
      await expect.poll(async () => (await readDrafts()).length).toBe(1);

      await page.reload();
      await helpers.waitForPageToBeIdle();

      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const editor = helpers.topModal();
      await expect(editor.getByTestId('restore-banner')).toBeVisible();
      await expect(editor.locator('[data-part="save-changes-button"]')).toBeVisible();

      // Editing dismisses the notice; Save Changes stays since the content is still unsaved.
      await editor.locator('textarea[name="value"]').click();
      await page.keyboard.type('!');
      await expect(editor.getByTestId('restore-banner')).not.toBeVisible();
      await expect(editor.locator('[data-part="save-changes-button"]')).toBeVisible();
    });

    test(`should keep the restored draft and clear it on save`, async ({ page, helpers }) => {
      const readDrafts = () => page.evaluate(() =>
        Object.keys(window.localStorage)
          .filter(key => key.startsWith('markdown-editor-draft:'))
          .map(key => ({ key, ...JSON.parse(window.localStorage.getItem(key)) }))
      );

      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const draftText = 'Draft body to be saved';
      await helpers.topModal().locator('textarea[name="value"]').click();
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type(draftText);
      await helpers.waitForPageToBeIdle();
      await expect.poll(async () => (await readDrafts()).length).toBe(1);

      await page.reload();
      await helpers.waitForPageToBeIdle();

      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const editor = helpers.topModal();
      await expect(editor.getByTestId('restore-banner')).toBeVisible();
      await expect(editor.locator('[data-part="save-changes-button"]')).toBeVisible();

      // Saving the restored draft without editing first hides the banner, then the
      // confirmed save clears the draft.
      await editor.locator('[data-part="save-changes-button"]').click();
      await helpers.waitForPageToBeIdle();
      await expect(editor.getByTestId('restore-banner')).not.toBeVisible();
      await expect(editor.locator('[data-part="save-changes-button"]')).toBeHidden();
      await expect.poll(async () => (await readDrafts()).length).toBe(0);
    });

    test(`should prompt only once when restoring a draft that changed elsewhere`, async ({ page, helpers }) => {
      const readDrafts = () => page.evaluate(() =>
        Object.keys(window.localStorage)
          .filter(key => key.startsWith('markdown-editor-draft:'))
          .map(key => ({ key, ...JSON.parse(window.localStorage.getItem(key)) }))
      );

      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const draftText = 'Draft body that diverged from the server';
      await helpers.topModal().locator('textarea[name="value"]').click();
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
      await page.keyboard.type(draftText);
      await helpers.waitForPageToBeIdle();
      await expect.poll(async () => (await readDrafts()).length).toBe(1);

      // Count restore confirms by stubbing window.confirm in every frame (the editor
      // renders inside a pinstripe-frame, so a page-level dialog listener can't see it).
      // The tally lives in localStorage, which is shared across same-origin frames.
      await page.addInitScript(() => {
        window.confirm = (message) => {
          const calls = JSON.parse(window.localStorage.getItem('__restoreConfirmCalls') || '[]');
          calls.push(message);
          window.localStorage.setItem('__restoreConfirmCalls', JSON.stringify(calls));
          return true; // act as if the user clicked OK
        };
      });

      await page.reload();
      await helpers.waitForPageToBeIdle();

      // With the editor closed (nothing will rewrite the draft), make it look like the
      // field changed elsewhere since: rewrite the recorded baseline so it no longer
      // matches the current server value. Reset the confirm tally for the open below.
      await page.evaluate(() => {
        const key = Object.keys(window.localStorage).find(k => k.startsWith('markdown-editor-draft:'));
        const record = JSON.parse(window.localStorage.getItem(key));
        record.baseline = 'a baseline that no longer matches the server value';
        window.localStorage.setItem(key, JSON.stringify(record));
        window.localStorage.removeItem('__restoreConfirmCalls');
      });

      await page.getByTestId("main").getByTestId("edit-post-body").click();
      await helpers.topModal().locator('textarea[name="body"]').click();
      await helpers.topModal().locator('textarea[name="value"]').waitFor();

      const editor = helpers.topModal();
      await expect(editor.getByTestId('restore-banner')).toBeVisible();
      await expect(editor.locator('textarea[name="value"]')).toHaveValue(draftText);
      await helpers.waitForPageToBeIdle();

      // The editor double-renders on open; a regression re-prompts on the second render.
      const confirmCalls = await page.evaluate(() =>
        JSON.parse(window.localStorage.getItem('__restoreConfirmCalls') || '[]')
      );
      expect(confirmCalls).toHaveLength(1);
      expect(confirmCalls[0]).toContain('changed elsewhere');
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
        await page.getByTestId("main").getByTestId("tab-tags").click();
        await page.getByTestId("main").getByTestId("edit-tagable-tags").click();

        for (const name of tagNames) {
          await helpers.topModal().getByText(name).click();
          await helpers.waitForPageToBeIdle();
        }

        await helpers.closeTopModal();
        for (const name of tagNames) {
          await expect(page.getByTestId("main").getByTestId("tagable-tags")).toContainText(name);
        }
        await expect(page.getByTestId("main").getByTestId("tagable-tags")).not.toContainText("none");

        for (const title of tagNames) {
          await expect(page.getByTestId("sidebar").getByTestId("tags")).toContainText(title);
        }
      });

      test(`should have an interface to allow the user to create a tag from within the tags modal`, async ({ page, helpers }) => {
        await expect(page.getByTestId("main").getByTestId("tagable-tags")).toContainText("Tags: none");
        await page.getByTestId("main").getByTestId("tab-tags").click();
        await page.getByTestId("main").getByTestId("edit-tagable-tags").click();

        await expect(helpers.topModal().getByTestId("create-tag")).not.toBeVisible();
        await helpers.topModal().locator('input[name="q"]').fill("Quince");
        await helpers.waitForPageToBeIdle();

        await helpers.topModal().getByTestId("create-tag").click();
        await helpers.waitForPageToBeIdle();
        await expect(helpers.topModal().getByTestId("create-tag")).not.toBeVisible();
        await expect(helpers.topModal().getByText("Quince")).toBeVisible();

        await helpers.closeTopModal();
        await expect(page.getByTestId("main").getByTestId("tagable-tags")).toContainText("Quince");
        await expect(page.getByTestId("sidebar").getByTestId("tags")).toContainText("Quince");
      });
    });

    test.describe("meta", () => {
      test(`should have an interface to allow the user to edit the meta title`, async ({ page, helpers }) => {
        await expect(page).toHaveTitle(/Alexandra Burgs/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Meta title: Alexandra Burgs");
        await expect(page).not.toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Meta title: Apple pear");

        await page.getByTestId("main").getByTestId("tab-meta").click();
        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ metaTitle: "Apple pear" });

        await expect(page).toHaveTitle(/Apple pear/);
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Meta title: Apple pear");
        await expect(page).not.toHaveTitle(/Alexandra Burgs/);
      });

      test(`should have an interface to allow the user to edit the meta description`, async ({ page, helpers }) => {
        await expect(page.locator("head meta[name=description]")).not.toBeAttached();
        await expect(page.getByTestId("main").getByTestId("post-meta")).not.toContainText("Meta description: Apple plum");

        await page.getByTestId("main").getByTestId("tab-meta").click();
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

        await page.getByTestId("main").getByTestId("tab-meta").click();
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

        await page.getByTestId("main").getByTestId("tab-meta").click();
        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ enableComments: false });
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Enable comments: false");
        await expect(page.getByTestId("main").getByTestId("add-comment")).not.toBeVisible();

        await page.getByTestId("main").getByTestId("tab-meta").click();
        await page.getByTestId("main").getByTestId("edit-post-meta").click();
        await helpers.submitForm({ enableComments: true });
        await expect(page.getByTestId("main").getByTestId("post-meta")).toContainText("Enable comments: true");
        await expect(page.getByTestId("main").getByTestId("add-comment")).toBeVisible();
      });
    });

    test(`should have an interface to allow the user to delete the current post`, async ({ page, helpers }) => {
      await expect(page.getByTestId("main").getByTestId("post-title")).toBeVisible();
      await page.getByTestId("main").getByTestId("tab-danger").click();
      await page.getByTestId("main").getByTestId("delete-post").click();
      await expect(page.getByTestId("main").getByTestId("post-title")).not.toBeVisible();
    });
  });

  describeSidebar('admin');
  describeFooter('admin');
});
