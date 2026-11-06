import { test, expect } from '../fixtures.js';
import { setupAdminTests } from './helpers.js';
import { COVER_PNG, LOGO_PNG } from '../constants.js';

const openSiteSettings = async (page, helpers) => {
  await page.getByTestId("navbar").getByTestId("settings").click();
  await helpers.topPopover().getByTestId("edit-site-meta").click();
  await expect(helpers.topModal()).toContainText("Edit site");
};

const navbarLogo = (page) => page.getByTestId("navbar").getByTestId("title").locator('img[class$="-icon"]');

test.describe('Admin - Site settings', () => {
  setupAdminTests();

  test(`should allow the user to upload, keep and remove the logo`, async ({ page, helpers }) => {
    await openSiteSettings(page, helpers);
    await expect(helpers.topModal()).toContainText("Square, at least 256×256.");
    await expect(helpers.topModal().getByTestId("logo-thumbnail")).not.toBeAttached();
    await expect(helpers.topModal().locator('input[name="removeLogo"]')).not.toBeAttached();
    await helpers.topModal().locator('input[type="file"][name="logo"]').setInputFiles(LOGO_PNG);
    await helpers.submitForm({});

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(navbarLogo(page)).toHaveAttribute("alt", "Lorem ipsum");
    await page.goto("/amber-trail");
    await helpers.waitForPageToBeIdle();
    await expect(navbarLogo(page)).toHaveAttribute("alt", "Lorem ipsum");
    await page.goto("/");
    await helpers.waitForPageToBeIdle();

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().getByTestId("logo-thumbnail")).toBeVisible();
    await expect(helpers.topModal().locator('input[name="removeLogo"]')).not.toBeChecked();
    await helpers.submitForm({ title: "Apple peach" });
    await expect(page.getByTestId("navbar")).toContainText("Apple peach");

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().getByTestId("logo-thumbnail")).toBeVisible();
    await helpers.submitForm({ removeLogo: true });
    await expect(navbarLogo(page)).not.toBeAttached();

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().getByTestId("logo-thumbnail")).not.toBeAttached();
    await expect(helpers.topModal().locator('input[name="removeLogo"]')).not.toBeAttached();
  });

  test(`should show the logo and blog title in the post byline only when a logo is set`, async ({ page, helpers }) => {
    const bylineLogo = page.getByTestId("post-byline-logo");
    const bylineBlog = page.getByTestId("post-byline-blog");

    await page.goto("/amber-trail");
    await helpers.waitForPageToBeIdle();
    await expect(bylineLogo).not.toBeAttached();
    await expect(bylineBlog).not.toBeAttached();

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="logo"]').setInputFiles(LOGO_PNG);
    await helpers.submitForm({});

    await page.goto("/amber-trail");
    await helpers.waitForPageToBeIdle();
    await expect(bylineLogo).toHaveAttribute("alt", "Lorem ipsum");
    await expect(bylineBlog).toContainText("Lorem ipsum");
    await expect(bylineBlog).toHaveAttribute("href", "/");

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.submitForm({ removeLogo: true });

    await page.goto("/amber-trail");
    await helpers.waitForPageToBeIdle();
    await expect(bylineLogo).not.toBeAttached();
    await expect(bylineBlog).not.toBeAttached();
  });

  test(`should send the cover, falling back to the logo, as the social image on every page`, async ({ page, helpers }) => {
    const ogImage = page.locator('head meta[property="og:image"]');
    const twitterImage = page.locator('head meta[name="twitter:image"]');
    const twitterCard = page.locator('head meta[name="twitter:card"]');
    const paths = ["/", "/amber-trail", "/excepturi-corporis", "/osinski-extensions"];

    const expectNoSocialImage = async (paths) => {
      for(const path of paths){
        await page.goto(path);
        await helpers.waitForPageToBeIdle();
        await expect(ogImage).not.toBeAttached();
        await expect(twitterImage).not.toBeAttached();
        await expect(twitterCard).not.toBeAttached();
      }
    };

    const expectSocialImage = async (slug, card) => {
      for(const path of paths){
        await page.goto(path);
        await helpers.waitForPageToBeIdle();
        const expected = new URL(`/${slug}`, page.url()).href;
        expect(expected.startsWith(`${new URL(page.url()).origin}/`)).toBe(true);
        expect(expected.startsWith("http")).toBe(true);
        await expect(ogImage).toHaveAttribute("content", expected);
        await expect(twitterImage).toHaveAttribute("content", expected);
        await expect(twitterCard).toHaveAttribute("content", card);
      }
    };

    await expectNoSocialImage(["/", "/amber-trail"]);

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="logo"]').setInputFiles(LOGO_PNG);
    await helpers.submitForm({});
    await expectSocialImage("logo-png", "summary");

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="cover"]').setInputFiles(COVER_PNG);
    await helpers.submitForm({});
    await expectSocialImage("cover-png", "summary_large_image");

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.submitForm({ removeCover: true });
    await expectSocialImage("logo-png", "summary");

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.submitForm({ removeLogo: true });
    await expectNoSocialImage(paths);
  });

  test(`should allow the user to set, keep and clear the description`,async ({ page, helpers }) => {
    await openSiteSettings(page, helpers);
    const names = await helpers.topModal().locator('form input[name]:not([type="hidden"])').evaluateAll(inputs => inputs.map(input => input.name));
    expect(names.indexOf("description")).toBe(names.indexOf("copyrightOwner") + 1);
    expect(names.indexOf("cover")).toBe(names.indexOf("description") + 1);
    await expect(helpers.topModal()).toContainText("One line under your title on the homepage, and its meta description unless the homepage sets its own.");
    await expect(helpers.topModal().locator('input[name="description"]')).toHaveValue("");
    await helpers.submitForm({ description: "Notes from the trail" });

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().locator('input[name="description"]')).toHaveValue("Notes from the trail");
    await helpers.submitForm({ description: "" });

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().locator('input[name="description"]')).toHaveValue("");
  });

  test(`should reject a non-image logo`, async ({ page, helpers }) => {
    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="logo"]').setInputFiles({
      name: 'notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Not an image'),
    });
    await helpers.submitForm({});
    await expect(helpers.topModal()).toContainText("Must be png, jpeg, gif, svg, webp, avif or tiff");
  });

  test(`should allow the user to upload, keep and remove the cover image`, async ({ page, helpers }) => {
    await openSiteSettings(page, helpers);
    await expect(helpers.topModal()).toContainText("Wide, at least 1600×400. Shown as a banner on your homepage.");
    await expect(helpers.topModal().getByTestId("cover-thumbnail")).not.toBeAttached();
    await expect(helpers.topModal().locator('input[name="removeCover"]')).not.toBeAttached();
    await helpers.topModal().locator('input[type="file"][name="cover"]').setInputFiles(COVER_PNG);
    await helpers.submitForm({});

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().getByTestId("cover-thumbnail")).toBeVisible();
    await expect(helpers.topModal().locator('input[name="removeCover"]')).not.toBeChecked();
    await helpers.submitForm({});

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().getByTestId("cover-thumbnail")).toBeVisible();
    await helpers.submitForm({ removeCover: true });

    await openSiteSettings(page, helpers);
    await expect(helpers.topModal().getByTestId("cover-thumbnail")).not.toBeAttached();
    await expect(helpers.topModal().locator('input[name="removeCover"]')).not.toBeAttached();
  });

  test(`should show the cover banner on the homepage only`, async ({ page, helpers }) => {
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-banner")).not.toBeAttached();
    await expect(page.getByTestId("cover-title")).not.toBeAttached();

    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="cover"]').setInputFiles(COVER_PNG);
    await helpers.topModal().locator('input[type="file"][name="logo"]').setInputFiles(LOGO_PNG);
    await helpers.submitForm({});

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-banner")).toHaveAttribute("alt", "");
    await expect(page.getByTestId("cover-logo")).toHaveAttribute("alt", "Lorem ipsum");
    await expect(page.getByTestId("cover-title")).toHaveText("Lorem ipsum");
    await expect(navbarLogo(page)).toHaveAttribute("alt", "Lorem ipsum");
    const bannerBox = await page.getByTestId("cover-banner").boundingBox();
    const titleBox = await page.getByTestId("cover-title").boundingBox();
    expect(titleBox.y).toBeGreaterThanOrEqual(bannerBox.y + bannerBox.height);

    await page.goto("/amber-trail");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-banner")).not.toBeAttached();

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.submitForm({ removeLogo: true });
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-banner")).toBeVisible();
    await expect(page.getByTestId("cover-title")).toBeVisible();
    await expect(page.getByTestId("cover-logo")).not.toBeAttached();

    await openSiteSettings(page, helpers);
    await helpers.submitForm({ removeCover: true });
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-banner")).not.toBeAttached();
    await expect(page.getByTestId("cover-title")).not.toBeAttached();
  });

  test(`should show the description under the title on the homepage only`, async ({ page, helpers }) => {
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-title")).not.toBeAttached();
    await expect(page.getByTestId("cover-description")).not.toBeAttached();

    await openSiteSettings(page, helpers);
    await helpers.submitForm({ description: "Notes from the trail" });
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-title")).toHaveText("Lorem ipsum");
    await expect(page.getByTestId("cover-description")).toHaveText("Notes from the trail");
    await expect(page.getByTestId("cover-banner")).not.toBeAttached();
    await expect(page.getByTestId("cover-logo")).not.toBeAttached();
    const navbarBox = await page.getByTestId("navbar").boundingBox();
    let titleBox = await page.getByTestId("cover-title").boundingBox();
    let descriptionBox = await page.getByTestId("cover-description").boundingBox();
    expect(titleBox.y).toBeGreaterThanOrEqual(navbarBox.y + navbarBox.height);
    expect(descriptionBox.y).toBeGreaterThanOrEqual(titleBox.y + titleBox.height);

    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="logo"]').setInputFiles(LOGO_PNG);
    await helpers.submitForm({});
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(navbarLogo(page)).toHaveAttribute("alt", "Lorem ipsum");
    await expect(page.getByTestId("cover-description")).toBeVisible();
    await expect(page.getByTestId("cover-logo")).not.toBeAttached();

    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="cover"]').setInputFiles(COVER_PNG);
    await helpers.submitForm({});
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-logo")).toBeVisible();
    const bannerBox = await page.getByTestId("cover-banner").boundingBox();
    titleBox = await page.getByTestId("cover-title").boundingBox();
    descriptionBox = await page.getByTestId("cover-description").boundingBox();
    expect(titleBox.y).toBeGreaterThanOrEqual(bannerBox.y + bannerBox.height);
    expect(descriptionBox.y).toBeGreaterThanOrEqual(titleBox.y + titleBox.height);

    await page.goto("/amber-trail");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-description")).not.toBeAttached();

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await openSiteSettings(page, helpers);
    await helpers.submitForm({ removeCover: true });
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-banner")).not.toBeAttached();
    await expect(page.getByTestId("cover-description")).toBeVisible();

    await openSiteSettings(page, helpers);
    await helpers.submitForm({ description: "" });
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId("cover-title")).not.toBeAttached();
    await expect(page.getByTestId("cover-description")).not.toBeAttached();
  });

  test(`should fall back to the description for the homepage meta description`, async ({ page, helpers }) => {
    const metaDescription = page.locator("head meta[name=description]");
    const ogDescription = page.locator('head meta[property="og:description"]');

    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(metaDescription).not.toBeAttached();
    await expect(ogDescription).not.toBeAttached();

    await openSiteSettings(page, helpers);
    await helpers.submitForm({ description: "Notes from the trail" });
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(metaDescription).toHaveAttribute("content", "Notes from the trail");
    await expect(ogDescription).toHaveAttribute("content", "Notes from the trail");

    await page.getByTestId("main").getByTestId("tab-meta").click();
    await page.getByTestId("main").getByTestId("edit-home-meta").click();
    await helpers.submitForm({ metaDescription: "Apple plum" });
    await expect(metaDescription).toHaveAttribute("content", "Apple plum");
    await expect(ogDescription).toHaveAttribute("content", "Apple plum");

    await page.getByTestId("main").getByTestId("tab-meta").click();
    await page.getByTestId("main").getByTestId("edit-home-meta").click();
    await helpers.submitForm({ metaDescription: "" });
    await openSiteSettings(page, helpers);
    await helpers.submitForm({ description: "" });
    await page.goto("/");
    await helpers.waitForPageToBeIdle();
    await expect(metaDescription).not.toBeAttached();
    await expect(ogDescription).not.toBeAttached();
  });

  test(`should reject a non-image cover image`, async ({ page, helpers }) => {
    await openSiteSettings(page, helpers);
    await helpers.topModal().locator('input[type="file"][name="cover"]').setInputFiles({
      name: 'notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Not an image'),
    });
    await helpers.submitForm({});
    await expect(helpers.topModal()).toContainText("Must be png, jpeg, gif, svg, webp, avif or tiff");
  });
});
