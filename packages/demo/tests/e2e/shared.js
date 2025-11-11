import { test, expect } from './fixtures.js';

const LOGO_PNG = "tests/e2e/logo.png";

export function describeApp(role) {
  test.describe(`When a ${role} user`, () => {
    test.beforeEach(async ({ page, helpers }) => {
      await page.goto("/");
      await helpers.waitForPageToBeIdle();
      await page.evaluate(() => {
        window.isPersistentContext = true;
      });
      if (role === "admin") {
        await helpers.signIn("admin@example.com");
      }
    });

    test.afterEach(async ({ page, helpers }) => {
      await helpers.waitForPageToBeIdle();
      const isPersistent = await page.evaluate(() => window.isPersistentContext);
      expect(isPersistent).toBe(true);
      await helpers.resetDatabaseFromSql();
    });

    test.describe("the home page", () => {
      describeNavbar(role);

      test.describe("main", () => {
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

        if (role === "admin") {
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
        }
      });

      describeSidebar(role);
      describeFooter(role);
    });

    test.describe("a post page", () => {
      test.beforeEach(async ({ page, helpers }) => {
        await page.getByTestId("main").getByText("Alexandra Burgs").click();
        await expect(page.getByTestId("main").getByTestId("post-title")).toContainText("Alexandra Burgs");
      });

      describeNavbar(role);

      test.describe("main", () => {
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
          
          if (role === "guest") {
            await helpers.submitForm({ email: "bob@example.com", legal: true });
            await helpers.submitForm({ password: "bob@example.com" });
            await helpers.submitForm({ name: "Bob" });
          }
          
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

        if (role === "admin") {
          test(`should have an interface to allow the user to unpublish/publish the post`, async ({ page, helpers }) => {
            await expect(page.getByTestId("main").getByTestId("unpublish-post")).toContainText("Unpublish");
            await page.getByTestId("main").getByTestId("unpublish-post").click();

            await expect(page.getByTestId("main").getByTestId("unpublish-post")).not.toBeVisible();
            await expect(page.getByTestId("main").getByTestId("publish-post")).toContainText("Publish");
            await page.getByTestId("main").getByTestId("publish-post").click();

            await helpers.submitForm({ notifySubscribers: true });

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
        }
      });

      describeSidebar(role);
      describeFooter(role);
    });

    test.describe("a basic page", () => {
      test.beforeEach(async ({ page, helpers }) => {
        await page.getByTestId("sidebar").getByText("Osinski Extensions").click();
        await expect(page.getByTestId("main").locator("h1")).toContainText("Osinski Extensions");
      });

      describeNavbar(role);

      test.describe("main", () => {
        test(`should have the correct contents`, async ({ page, helpers }) => {
          await expect(page.getByTestId("main")).toContainText("Similique molestias illum");
        });

        if (role === "admin") {
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
        }
      });

      describeSidebar(role);
      describeFooter(role);
    });

    test.describe("a tag page", () => {
      test.beforeEach(async ({ page, helpers }) => {
        await page.getByTestId("sidebar").getByText("Excepturi Corporis").click();
        await expect(page.getByTestId("main").locator("h2").first()).toContainText("Excepturi Corporis");
      });

      describeNavbar(role);

      test.describe("main", () => {
        test(`should have the correct contents`, async ({ page, helpers }) => {
          await expect(page.getByTestId("main")).toContainText("Altenwerth Ford");

          await assertLoadMoreButtonWorks(page, helpers, [
            "Parker Landing",
            "Toni Pine",
            "Zulauf Roads",
          ]);
        });

        if (role === "admin") {
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
        }
      });

      describeSidebar(role);
      describeFooter(role);
    });

    test.describe("a user page", () => {
      test.beforeEach(async ({ page, helpers }) => {
        await page.getByTestId("main").getByText("Alexandra Burgs").click();
        await expect(page.getByTestId("main").locator("h1")).toContainText("Alexandra Burgs");
        await page.getByTestId("main").getByText("Admin").click();
        await expect(page.getByTestId("main").locator("h2").first()).toContainText("Admin");
      });

      describeNavbar(role);

      test.describe("main", () => {
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

        if (role === "admin") {
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
        }
      });

      describeSidebar(role);
      describeFooter(role);
    });
  });
}

function describeNavbar(role) {
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

function describeSidebar(role) {
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

function describeFooter(role) {
  test.describe(`footer`, () => {
    test(`should have the correct contents`, async ({ page, helpers }) => {
      await expect(page.getByTestId("footer")).toContainText("Lorem ipsum");
      await expect(page.getByTestId("footer")).toContainText("Powered by Blognami");
    });
  });
}

async function assertLoadMoreButtonWorks(page, helpers, expectedTitles) {
  for (const expectedTitle of expectedTitles) {
    await page.getByTestId("main").getByTestId("load-more").click();
    await expect(page.getByTestId("main")).toContainText(expectedTitle);
  }

  await expect(page.getByTestId("main").getByTestId("load-more")).not.toBeVisible();
}

const POST_TITLES = [
  "Alexandra Burgs",
  "Altenwerth Ford",
  "Amber Trail",
  "Balistreri Light",
  "Ben Route",
  "Brianne Falls",
  "Camron Creek",
  "Carter Fort",
  "Celestine Crossing",
  "Chester Ferry",
  "Chester Roads",
  "Colton Station",
  "Cristobal Via",
  "Dawn Freeway",
  "Denesik Plaza",
  "Dessie Shore",
  "Dicki Spring",
  "Earline Wells",
  "Efrain Coves",
  "Ellsworth Squares",
  "Estefania Course",
  "Estell Overpass",
  "Eudora Ridge",
  "Ewell Canyon",
  "Fadel Valley",
  "Feest Wells",
  "Florine Brook",
  "Gerard Shoals",
  "Goldner Walks",
  "Graham Place",
  "Gregg Locks",
  "Gutmann Pines",
  "Gutmann Village",
  "Heidenreich Forge",
  "Hermann Stream",
  "Hessel Views",
  "Hilll Motorway",
  "Hilll Ville",
  "Imogene Walks",
  "Jaskolski Ways",
  "Jaylon Orchard",
  "Jazlyn Street",
  "Jenkins Mills",
  "Jesus Junction",
  "Jude Ville",
  "Kaycee Street",
  "Kemmer Keys",
  "Kilback Path",
  "Klocko Dale",
  "Kris Dale",
  "Kristy Trail",
  "Lamar Roads",
  "Lamont Camp",
  "Leffler Plains",
  "Lesly Glen",
  "Lewis Spring",
  "Lisandro Burgs",
  "Llewellyn Mill",
  "Lora Cliffs",
  "Lowe Lane",
  "Marjolaine View",
  "Mauricio Springs",
  "Mavis Camp",
  "Mayert Overpass",
  "Mollie Dale",
  "Mosciski Alley",
  "Muller Ridges",
  "Nathan Dale",
  "Neil Streets",
  "Nicola Circle",
  "Parker Landing",
  "Paucek Course",
  "Randi Pine",
  "Rau Walks",
  "Reese Points",
  "Rempel Forest",
  "Rosalee Keys",
  "Rosenbaum Stravenue",
  "Ruecker Fort",
  "Schmeler Garden",
  "Schulist Glens",
  "Sedrick Grove",
  "Shields Glen",
  "Sibyl Island",
  "Smitham Pass",
  "Stehr Island",
  "Swift Parkway",
  "Teagan Square",
  "Thompson Expressway",
  "Tia Expressway",
  "Toney Ridges",
  "Toni Pine",
  "Tony Prairie",
  "Tristian Mission",
  "Tyra Groves",
  "Ullrich Heights",
  "Vita Estates",
  "Von Tunnel",
  "Wilkinson Locks",
  "Wisozk Row",
  "Zulauf Roads",
];