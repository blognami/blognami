import { test, expect } from '../fixtures.js';
import { QUICK, STRIPE_ENABLED, IS_MULTI_TENANT } from '../constants.js';

test.describe('Custom domain paywall transition', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');
  test.skip(!STRIPE_ENABLED, 'Requires STRIPE_API_KEY');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test('paywall blocks custom domain for unpaid tenant, unblocked after subscribing', async ({ playwright, page, helpers }) => {
    test.skip(QUICK, 'Skipped in quick mode');

    // Step 1: Create a demo tenant (subdomain is already title-based)
    const createResponse = await page.request.get('/_test/create_uuid_tenant');
    const { slug, sessionCookie } = await createResponse.json();
    const hostname = `${slug}.blognami.com`;

    // Step 2: Verify custom domain settings show paywall for unpaid tenant
    const paywallResponse = await page.request.get('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
      headers: {
        'x-host': hostname,
        'cookie': sessionCookie
      }
    });
    expect(paywallResponse.ok()).toBe(true);
    const paywallHtml = await paywallResponse.text();
    expect(paywallHtml).toContain('Publisher plan');
    expect(paywallHtml).toContain('Choose a plan');

    // Step 3: Set up browser context and subscribe via Stripe checkout
    await page.context().addCookies([{
      name: 'pinstripeSession',
      value: sessionCookie.replace('pinstripeSession=', ''),
      domain: '127.0.0.1',
      path: '/',
    }]);
    await page.setExtraHTTPHeaders({ 'x-host': hostname });
    await page.goto('/');
    await helpers.waitForPageToBeIdle();

    // Click subscribe on the demo banner
    const subscribeButton = page.getByTestId('demo-banner-subscribe-button');
    await expect(subscribeButton).toBeVisible();
    await subscribeButton.click();
    await helpers.waitForPageToBeIdle();

    // Select Publisher plan
    await page.getByRole('link', { name: 'Select Publisher' }).click();

    // Complete Stripe checkout
    await helpers.completeStripeCheckout('Admin');
    await helpers.waitForPageToBeIdle();

    // Step 4: Verify custom domain form is now accessible (no paywall)
    const formResponse = await page.request.get('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
      headers: {
        'x-host': hostname,
        'cookie': sessionCookie
      }
    });
    expect(formResponse.ok()).toBe(true);
    const formHtml = await formResponse.text();
    expect(formHtml).not.toContain('Choose a plan');
    expect(formHtml).toContain('Connect Custom Domain');
  });
});
