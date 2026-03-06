import { test, expect } from '../fixtures.js';
import { QUICK, IS_MULTI_TENANT } from '../constants.js';

async function createPublisherTenant(page) {
  const response = await page.request.get('/_test/setup_custom_domain_test?action=create_publisher_tenant');
  return response.json();
}

async function addVerifiedHost(page, tenantId, hostname) {
  await page.request.get(`/_test/setup_custom_domain_test?action=add_verified_host&tenantId=${tenantId}&hostname=${hostname}`);
}

async function addRedirectHost(page, tenantId, hostname) {
  await page.request.get(`/_test/setup_custom_domain_test?action=add_redirect_host&tenantId=${tenantId}&hostname=${hostname}`);
}

test.describe('Custom domain', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test.describe('entitlement gate', () => {
    test('unpaid tenant sees paywall', async ({ page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      const { slug, sessionCookie } = await createResponse.json();

      const response = await page.request.get('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
        headers: {
          'x-host': `${slug}.blognami.com`,
          'cookie': sessionCookie
        }
      });

      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('Publisher plan');
      expect(html).toContain('Choose a plan');
    });
  });

  test.describe('domain validation', () => {
    test('invalid domain format shows validation error', async ({ page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const { slug, sessionCookie } = await createPublisherTenant(page);

      const response = await page.request.post('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
        headers: {
          'x-host': `${slug}.blognami.com`,
          'cookie': sessionCookie
        },
        form: { domain: 'not a valid domain!' }
      });

      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('valid domain name');
    });

    test('blognami.com subdomain is rejected', async ({ page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const { slug, sessionCookie } = await createPublisherTenant(page);

      const response = await page.request.post('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
        headers: {
          'x-host': `${slug}.blognami.com`,
          'cookie': sessionCookie
        },
        form: { domain: 'test.blognami.com' }
      });

      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('cannot use a blognami.com subdomain');
    });

  });

  test.describe('existing domain display', () => {
    test('shows connected domain with remove button', async ({ page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const { slug, tenantId, sessionCookie } = await createPublisherTenant(page);
      await addVerifiedHost(page, tenantId, 'my-custom.example.com');

      const response = await page.request.get('http://127.0.0.1:3000/_actions/admin/connect_custom_domain', {
        headers: {
          'x-host': `${slug}.blognami.com`,
          'cookie': sessionCookie
        }
      });

      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('my-custom.example.com');
      expect(html).toContain('connected');
      expect(html).toContain('Remove');
    });
  });

  test.describe('domain resolution', () => {
    test('verified custom domain resolves to correct tenant', async ({ page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const { tenantId, sessionCookie } = await createPublisherTenant(page);
      await addVerifiedHost(page, tenantId, 'custom.example.com');

      const response = await page.request.get('http://127.0.0.1:3000/', {
        headers: {
          'host': 'custom.example.com',
          'cookie': sessionCookie
        },
        maxRedirects: 0
      });

      expect(response.status()).toBe(200);
    });

    test('redirect-type host 301s to canonical host', async ({ page }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const { slug, tenantId } = await createPublisherTenant(page);
      await addRedirectHost(page, tenantId, 'old.example.com');

      const redirectResponse = await page.request.get('http://127.0.0.1:3000/', {
        headers: {
          'x-host': 'nonexistent-for-redirect-test',
          'host': 'old.example.com'
        },
        maxRedirects: 0
      });

      expect(redirectResponse.status()).toBe(301);
      const location = redirectResponse.headers()['location'];
      expect(location).toContain(`${slug}.blognami.com`);
    });

    test('unknown hostname returns 404', async ({ page }) => {
      const response = await page.request.get('http://127.0.0.1:3000/', {
        headers: {
          'x-host': 'nonexistent-for-404-test',
          'host': 'completely-unknown.example.com'
        },
        maxRedirects: 0
      });
      expect(response.status()).toBe(404);
    });
  });
});
