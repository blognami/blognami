import { test, expect } from '../fixtures.js';
import { IS_MULTI_TENANT } from '../constants.js';

test.describe('Demo creation via portal', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test('demo tenant is accessible at a title-based hostname with demo banner visible', async ({ page, helpers }) => {
    // Create a demo tenant via the portal-simulating helper
    const createResponse = await page.request.get('/_test/create_demo_tenant');
    const { slug, hostname, sessionCookie } = await createResponse.json();

    // Verify the hostname is title-based (not a UUID)
    expect(slug).toBe('my-demo-blog');
    expect(hostname).toBe(`${slug}.blognami.com`);

    // Set up the page to visit the new demo tenant
    await page.context().addCookies([{
      name: 'pinstripeSession',
      value: sessionCookie.replace('pinstripeSession=', ''),
      domain: '127.0.0.1',
      path: '/',
    }]);
    await page.setExtraHTTPHeaders({ 'x-host': hostname });
    await page.goto('/');
    await helpers.waitForPageToBeIdle();

    // Verify the site is accessible (page loaded without error)
    await expect(page.locator('body')).toBeVisible();

    // Verify the demo banner is visible with subscribe button (no claim button)
    await expect(page.getByTestId('demo-banner-subscribe-button')).toBeVisible();
  });
});
