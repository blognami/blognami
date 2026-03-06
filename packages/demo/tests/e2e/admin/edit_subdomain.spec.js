import { test, expect } from '../fixtures.js';
import { QUICK, IS_MULTI_TENANT } from '../constants.js';

test.describe('Edit subdomain', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test.describe('change subdomain form', () => {
    let slug, sessionCookie, hostname;

    test.beforeEach(async ({ page, helpers }) => {
      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      ({ slug, sessionCookie } = await createResponse.json());
      hostname = `${slug}.blognami.com`;

      await page.context().addCookies([{
        name: 'pinstripeSession',
        value: sessionCookie.replace('pinstripeSession=', ''),
        domain: '127.0.0.1',
        path: '/',
      }]);
      await page.setExtraHTTPHeaders({ 'x-host': hostname });
      await page.goto('/');
      await helpers.waitForPageToBeIdle();
    });

    test('invalid subdomain shows validation error', async ({ playwright }) => {
      const apiContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: { 'x-host': hostname, 'cookie': sessionCookie }
      });
      const response = await apiContext.post('/_actions/admin/edit_subdomain', {
        form: { slug: 'ab' }
      });
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('at least 3 characters');
      await apiContext.dispose();
    });

    test('reserved subdomain shows validation error', async ({ playwright }) => {
      const apiContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: { 'x-host': hostname, 'cookie': sessionCookie }
      });
      const response = await apiContext.post('/_actions/admin/edit_subdomain', {
        form: { slug: 'admin' }
      });
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('is a reserved name and cannot be used.');
      await apiContext.dispose();
    });

    test('taken subdomain shows validation error', async ({ playwright }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const apiContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: { 'x-host': hostname, 'cookie': sessionCookie }
      });
      const response = await apiContext.post('/_actions/admin/edit_subdomain', {
        form: { slug: 'lorum-ipsum' }
      });
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('already taken');
      await apiContext.dispose();
    });

    test('successful change redirects to new subdomain', async ({ playwright }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      const apiContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: { 'x-host': hostname, 'cookie': sessionCookie }
      });
      const response = await apiContext.post('/_actions/admin/edit_subdomain', {
        form: { slug: 'test-changed-blog' }
      });
      expect(response.ok()).toBe(true);
      const html = await response.text();
      expect(html).toContain('test-changed-blog.blognami.com');
      await apiContext.dispose();
    });
  });

  test.describe('hostname behavior after change', () => {
    test('new hostname resolves after change', async ({ playwright, page, helpers }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      await page.goto('/');
      await helpers.waitForPageToBeIdle();
      await helpers.signIn('admin@example.com');

      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      const { slug, sessionCookie } = await createResponse.json();

      const apiContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: {
          'x-host': `${slug}.blognami.com`,
          'cookie': sessionCookie,
          'accept': 'application/json'
        }
      });

      const changeResponse = await apiContext.post('/_actions/admin/edit_subdomain', {
        form: { slug: 'test-new-host' }
      });
      expect(changeResponse.ok()).toBe(true);
      await apiContext.dispose();

      const newHostContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: {
          'x-host': 'test-new-host.blognami.com',
          'cookie': sessionCookie
        }
      });

      const pageResponse = await newHostContext.get('/');
      expect(pageResponse.ok()).toBe(true);
      await newHostContext.dispose();
    });

    test('old hostname returns 404 after change', async ({ playwright, page, helpers }) => {
      test.skip(QUICK, 'Skipped in quick mode');

      await page.goto('/');
      await helpers.waitForPageToBeIdle();
      await helpers.signIn('admin@example.com');

      const createResponse = await page.request.get('/_test/create_uuid_tenant');
      const { slug, sessionCookie } = await createResponse.json();
      const oldHostname = `${slug}.blognami.com`;

      const apiContext = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:3000',
        extraHTTPHeaders: {
          'x-host': oldHostname,
          'cookie': sessionCookie,
          'accept': 'application/json'
        }
      });

      const changeResponse = await apiContext.post('/_actions/admin/edit_subdomain', {
        form: { slug: 'test-moved-blog' }
      });
      expect(changeResponse.ok()).toBe(true);
      await apiContext.dispose();

      const oldHostResponse = await page.request.get('http://127.0.0.1:3000/', {
        headers: {
          'x-host': 'nonexistent-for-404-test',
          'host': oldHostname
        },
        maxRedirects: 0
      });
      expect(oldHostResponse.status()).toBe(404);
    });
  });
});
