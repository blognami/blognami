import { test, expect } from '../fixtures.js';
import { QUICK, STRIPE_ENABLED, IS_MULTI_TENANT } from '../constants.js';

async function claimViaApi(playwright, tenantHostname, sessionCookie, slug) {
  const apiContext = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3000',
    extraHTTPHeaders: {
      'x-host': tenantHostname,
      'cookie': sessionCookie,
      'accept': 'application/json'
    }
  });

  const claimResponse = await apiContext.post('/_actions/admin/claim_site', {
    form: { slug }
  });
  expect(claimResponse.ok()).toBe(true);

  await apiContext.dispose();
}

test.describe('Full launch funnel: demo → claim → subscribe → custom domain', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');
  test.skip(!STRIPE_ENABLED, 'Requires STRIPE_API_KEY');
  test.skip(QUICK, 'Skipped in quick mode');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test('demo → claim → subscribe → custom domain', async ({ playwright, page, helpers }) => {
    // Step 1: Create a demo tenant
    const createResponse = await page.request.get('/_test/create_uuid_tenant');
    const { uuid, sessionCookie } = await createResponse.json();
    const guidHostname = `${uuid}.blognami.com`;

    // Set up page to target the demo tenant
    await page.context().addCookies([{
      name: 'pinstripeSession',
      value: sessionCookie.replace('pinstripeSession=', ''),
      domain: '127.0.0.1',
      path: '/',
    }]);
    await page.setExtraHTTPHeaders({ 'x-host': guidHostname });
    await page.goto('/');
    await helpers.waitForPageToBeIdle();

    // Verify demo tenant is accessible at GUID hostname with demo banner
    await expect(page.getByTestId('demo-banner-subscribe-button')).toBeVisible();
    await expect(page.getByTestId('demo-banner-claim-button')).toBeVisible();

    // Step 2: Claim a subdomain via API
    const slug = 'test-funnel-blog';
    await claimViaApi(playwright, guidHostname, sessionCookie, slug);
    const claimedHostname = `${slug}.blognami.com`;

    // Verify GUID hostname 301-redirects to claimed slug (preserving path and query)
    const redirectResponse = await page.request.get('http://127.0.0.1:3000/some-path?foo=bar', {
      headers: {
        'x-host': 'nonexistent-for-redirect-test',
        'host': guidHostname
      },
      maxRedirects: 0
    });
    expect(redirectResponse.status()).toBe(301);
    const location = redirectResponse.headers()['location'];
    expect(location).toContain(claimedHostname);
    expect(location).toContain('/some-path');
    expect(location).toContain('foo=bar');

    // Switch to claimed hostname and verify site loads
    await page.setExtraHTTPHeaders({ 'x-host': claimedHostname });
    await page.goto('/');
    await helpers.waitForPageToBeIdle();
    await expect(page.locator('body')).toBeVisible();

    // Step 3: Subscribe via Stripe checkout (Publisher plan for custom domain access)
    const subscribeButton = page.getByTestId('demo-banner-subscribe-button');
    await expect(subscribeButton).toBeVisible();
    await subscribeButton.click();
    await helpers.waitForPageToBeIdle();
    await page.getByRole('link', { name: 'Select Publisher' }).click();
    await helpers.completeStripeCheckout('Admin');
    await helpers.waitForPageToBeIdle();

    // Verify demo banner is removed after subscribing
    await expect(subscribeButton).not.toBeVisible();

    // Step 4: Verify custom domain settings page is accessible (no paywall)
    const customDomainResponse = await page.request.get('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
      headers: {
        'x-host': claimedHostname,
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
