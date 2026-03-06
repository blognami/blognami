import { test, expect } from '../fixtures.js';
import { QUICK, STRIPE_ENABLED, IS_MULTI_TENANT } from '../constants.js';

test.describe('Full launch funnel: demo → subscribe → custom domain', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');
  test.skip(!STRIPE_ENABLED, 'Requires STRIPE_API_KEY');
  test.skip(QUICK, 'Skipped in quick mode');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test('demo → subscribe → custom domain', async ({ playwright, page, helpers }) => {
    // Step 1: Create a demo tenant (subdomain is title-based)
    const createResponse = await page.request.get('/_test/create_uuid_tenant');
    const { slug, sessionCookie } = await createResponse.json();
    const hostname = `${slug}.blognami.com`;

    // Set up page to target the demo tenant
    await page.context().addCookies([{
      name: 'pinstripeSession',
      value: sessionCookie.replace('pinstripeSession=', ''),
      domain: '127.0.0.1',
      path: '/',
    }]);
    await page.setExtraHTTPHeaders({ 'x-host': hostname });
    await page.goto('/');
    await helpers.waitForPageToBeIdle();

    // Verify demo tenant is accessible with demo banner
    await expect(page.getByTestId('demo-banner-subscribe-button')).toBeVisible();

    // Step 2: Subscribe via Stripe checkout (Publisher plan for custom domain access)
    const subscribeButton = page.getByTestId('demo-banner-subscribe-button');
    await subscribeButton.click();
    await helpers.waitForPageToBeIdle();
    await page.getByRole('link', { name: 'Select Publisher' }).click();
    await helpers.completeStripeCheckout('Admin');
    await helpers.waitForPageToBeIdle();

    // Verify demo banner is removed after subscribing
    await expect(subscribeButton).not.toBeVisible();

    // Step 3: Verify custom domain settings page is accessible (no paywall)
    const customDomainResponse = await page.request.get('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
      headers: {
        'x-host': hostname,
        'cookie': sessionCookie
      }
    });
    expect(customDomainResponse.ok()).toBe(true);
    const html = await customDomainResponse.text();
    // Should NOT show the paywall - should show the domain connection form
    expect(html).not.toContain('Choose a plan');
    expect(html).toContain('Connect Custom Domain');
  });
});
