import { test, expect } from '../fixtures.js';
import { QUICK, IS_MULTI_TENANT } from '../constants.js';

const UUID_TENANT = '00000000-0000-0000-0000-000000000000';

async function signInToUuidTenant(playwright) {
  // Generate an OTP for the UUID tenant's admin user
  const otpContext = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3000',
    extraHTTPHeaders: { 'x-tenant': UUID_TENANT }
  });
  const otpResponse = await otpContext.get('/_test/generate_otp?email=admin@example.com');
  const { otp } = await otpResponse.json();

  // Submit the sign-in form step 1 (email + legal)
  const step1Response = await otpContext.post('/_actions/guest/sign_in', {
    form: { email: 'admin@example.com', legal: 'true' }
  });

  // Submit the sign-in form step 2 (OTP verification)
  const step2Response = await otpContext.post('/_actions/guest/sign_in/verify_password?email=admin@example.com', {
    form: { password: otp }
  });

  const setCookieHeader = step2Response.headers()['set-cookie'] || '';
  const match = setCookieHeader.match(/pinstripeSession=[^;]+/);
  const sessionCookie = match ? match[0] : '';

  await otpContext.dispose();
  return sessionCookie;
}

async function claimViaApi(playwright, tenantName, sessionCookie, slug) {
  const apiContext = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:3000',
    extraHTTPHeaders: {
      'x-tenant': tenantName,
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

test.describe('Claim your site', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test.describe('claim form', () => {
    test.beforeEach(async ({ playwright, page, helpers }) => {
      const sessionCookie = await signInToUuidTenant(playwright);

      await page.context().addCookies([{
        name: 'pinstripeSession',
        value: sessionCookie.replace('pinstripeSession=', ''),
        domain: '127.0.0.1',
        path: '/',
      }]);
      await page.setExtraHTTPHeaders({ 'x-tenant': UUID_TENANT });
      await page.goto('/');
      await helpers.waitForPageToBeIdle();
    });

    test('invalid subdomain shows validation error', async ({ page, helpers }) => {
      await page.getByTestId('demo-banner-claim-button').click();
      await helpers.waitForPageToBeIdle();

      await helpers.submitForm({ slug: 'ab' });
      await expect(helpers.topModal()).toContainText('at least 3 characters');
    });

    test('taken subdomain shows validation error', async ({ page, helpers }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      await page.getByTestId('demo-banner-claim-button').click();
      await helpers.waitForPageToBeIdle();

      await helpers.submitForm({ slug: 'lorum-ipsum' });
      await expect(helpers.topModal()).toContainText('already taken');
    });

    test('successful claim redirects', async ({ page, helpers }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      await page.getByTestId('demo-banner-claim-button').click();
      await helpers.waitForPageToBeIdle();

      await helpers.submitForm({ slug: 'test-claim-blog' }, { skipWaitForIdle: true });

      await page.waitForFunction(() => {
        const scripts = document.querySelectorAll('script');
        for (const s of scripts) {
          if (s.textContent.includes('test-claim-blog.blognami.com')) return true;
        }
        return false;
      }, { timeout: 10000 });
    });
  });

  test.describe('redirect and hostname behavior', () => {
    test.beforeEach(async ({ page, helpers }) => {
      await page.goto('/');
      await helpers.waitForPageToBeIdle();
      await helpers.signIn('admin@example.com');
    });

    test('old hostname redirects after claim', async ({ playwright, page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      const { uuid, sessionCookie } = await createResponse.json();

      await claimViaApi(playwright, uuid, sessionCookie, 'test-redirect-blog');

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
      expect(location).toContain('test-redirect-blog.blognami.com');
      expect(location).toContain('/some-path');
      expect(location).toContain('foo=bar');
    });

    test('redirect applies to homepage and content routes', async ({ playwright, page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      const { uuid, sessionCookie } = await createResponse.json();

      await claimViaApi(playwright, uuid, sessionCookie, 'test-routes-blog');

      const oldHost = `${uuid}.blognami.com`;

      const homepageResponse = await page.request.get('http://127.0.0.1:3000/', {
        headers: { 'x-tenant': 'nonexistent-for-redirect-test', 'host': oldHost },
        maxRedirects: 0
      });
      expect(homepageResponse.status()).toBe(301);
      const homepageLocation = homepageResponse.headers()['location'];
      expect(homepageLocation).toContain('test-routes-blog.blognami.com');
      expect(homepageLocation).toMatch(/\/$/);

      const contentResponse = await page.request.get('http://127.0.0.1:3000/posts/my-post', {
        headers: { 'x-tenant': 'nonexistent-for-redirect-test', 'host': oldHost },
        maxRedirects: 0
      });
      expect(contentResponse.status()).toBe(301);
      const contentLocation = contentResponse.headers()['location'];
      expect(contentLocation).toContain('test-routes-blog.blognami.com');
      expect(contentLocation).toContain('/posts/my-post');
    });

    test('redirect does not affect unrelated tenants', async ({ playwright, page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const createResponse1 = await page.request.get('/_test/create_uuid_tenant');
      const { uuid: uuid1, sessionCookie: cookie1 } = await createResponse1.json();

      const createResponse2 = await page.request.get('/_test/create_uuid_tenant');
      const { uuid: uuid2 } = await createResponse2.json();

      await claimViaApi(playwright, uuid1, cookie1, 'test-isolation-blog');

      const unclaimed = await page.request.get('http://127.0.0.1:3000/', {
        headers: { 'x-tenant': uuid2 },
        maxRedirects: 0
      });
      expect(unclaimed.status()).toBe(200);

      const oldHost1 = `${uuid1}.blognami.com`;
      const claimed = await page.request.get('http://127.0.0.1:3000/', {
        headers: { 'x-tenant': 'nonexistent-for-redirect-test', 'host': oldHost1 },
        maxRedirects: 0
      });
      expect(claimed.status()).toBe(301);
      expect(claimed.headers()['location']).toContain('test-isolation-blog.blognami.com');
    });

    test('unknown hostname returns 404', async ({ page }) => {
      const response = await page.request.get('http://127.0.0.1:3000/', {
        headers: {
          'x-tenant': 'nonexistent-for-404-test',
          'host': 'totally-unknown.blognami.com'
        },
        maxRedirects: 0
      });
      expect(response.status()).toBe(404);
    });

    test('canonical URL uses claimed hostname', async ({ playwright, page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      const { uuid, sessionCookie } = await createResponse.json();

      await claimViaApi(playwright, uuid, sessionCookie, 'test-canonical-blog');

      const claimedContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: {
          'x-tenant': 'test-canonical-blog',
          'cookie': sessionCookie
        }
      });

      const pageResponse = await claimedContext.get('/');
      expect(pageResponse.ok()).toBe(true);
      const html = await pageResponse.text();
      expect(html).toContain('<link rel="canonical" href="http://test-canonical-blog.blognami.com/"');

      await claimedContext.dispose();
    });
  });
});
