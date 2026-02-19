
import { test, expect } from './fixtures.js';

const IS_MULTI_TENANT = process.env.TENANCY === 'multi';
const QUICK = process.env.QUICK === 'true';

test.describe('Claim your site', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');

  test.beforeEach(async ({ page, helpers }) => {
    await page.goto('/');
    await helpers.waitForPageToBeIdle();
    await helpers.signIn('admin@example.com');
  });

  test.afterEach(async ({ page, helpers }) => {
    await helpers.waitForPageToBeIdle();
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test('check_subdomain_availability returns validation errors for invalid slugs', async ({ page }) => {
    // Too short
    let response = await page.request.get('/_actions/admin/check_subdomain_availability?slug=ab');
    expect(response.ok()).toBe(true);
    let data = await response.json();
    expect(data.available).toBe(false);
    expect(data.errors.some(e => e.includes('at least 3 characters'))).toBe(true);

    // Uppercase
    response = await page.request.get('/_actions/admin/check_subdomain_availability?slug=MyBlog');
    data = await response.json();
    expect(data.available).toBe(false);
    expect(data.errors.some(e => e.includes('lowercase'))).toBe(true);

    // Leading hyphen
    response = await page.request.get('/_actions/admin/check_subdomain_availability?slug=-foo');
    data = await response.json();
    expect(data.available).toBe(false);
    expect(data.errors.some(e => e.includes('start with a hyphen'))).toBe(true);

    // Reserved word — should not return suggestions
    response = await page.request.get('/_actions/admin/check_subdomain_availability?slug=admin');
    data = await response.json();
    expect(data.available).toBe(false);
    expect(data.errors.some(e => e.includes('reserved'))).toBe(true);
    expect(data.suggestions || []).toEqual([]);
  });

  if (!QUICK) {
    test('check_subdomain_availability returns available for valid slugs', async ({ page }) => {
      const response = await page.request.get('/_actions/admin/check_subdomain_availability?slug=my-cool-blog');
      const data = await response.json();
      expect(data.available).toBe(true);
      expect(data.errors).toEqual([]);
    });

    test('check_subdomain_availability returns suggestions for taken slugs', async ({ page }) => {
      const response = await page.request.get('/_actions/admin/check_subdomain_availability?slug=lorum-ipsum');
      const data = await response.json();
      expect(data.available).toBe(false);
      expect(data.errors.some(e => e.includes('already taken'))).toBe(true);
      expect(data.suggestions.length).toBeGreaterThan(0);
      expect(data.suggestions.length).toBeLessThanOrEqual(5);
    });

    test('claim_site succeeds for UUID tenant and old hostname redirects', async ({ playwright, page, helpers }) => {
      // Create a UUID tenant (returns uuid and a pre-created session cookie)
      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      const { uuid, sessionCookie } = await createResponse.json();

      // Use a standalone request context to avoid cookie conflicts with the page
      const apiContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: {
          'x-tenant': uuid,
          'cookie': sessionCookie
        }
      });

      const claimResponse = await apiContext.post('/_actions/admin/claim_site', {
        form: { slug: 'test-claim-blog' }
      });
      const claimData = await claimResponse.json();
      expect(claimData.success).toBe(true);
      expect(claimData.newHost).toBe('test-claim-blog.blognami.com');

      await apiContext.dispose();

      // Verify the subdomain is now taken (use page context which is authenticated on lorum-ipsum tenant)
      const checkResponse = await page.request.get('/_actions/admin/check_subdomain_availability?slug=test-claim-blog');
      const checkData = await checkResponse.json();
      expect(checkData.available).toBe(false);

      // Test old hostname redirect
      const oldHost = `${uuid}.blognami.com`;
      const redirectResponse = await page.request.get('http://127.0.0.1:3000/some-path?foo=bar', {
        headers: {
          'x-tenant': 'nonexistent-for-redirect-test',
          'host': oldHost
        },
        maxRedirects: 0
      });

      expect(redirectResponse.status()).toBe(301);
      const location = redirectResponse.headers()['location'];
      expect(location).toContain('test-claim-blog.blognami.com');
      expect(location).toContain('/some-path');
      expect(location).toContain('foo=bar');
    });
  }
});
