import { test, expect } from '../fixtures.js';
import { IS_MULTI_TENANT } from '../constants.js';

async function createPausedTenant(page, helpers) {
  // Ensure the server/database is ready after any prior reset
  await page.goto('/');
  await helpers.waitForPageToBeIdle();
  const createResponse = await page.request.get('/_test/create_paused_tenant');
  return await createResponse.json();
}

async function setupPausedPage(page, helpers, data) {
  await page.context().addCookies([{
    name: 'pinstripeSession',
    value: data.sessionCookie.replace('pinstripeSession=', ''),
    domain: '127.0.0.1',
    path: '/',
  }]);
  await page.setExtraHTTPHeaders({ 'x-host': `${data.uuid}.blognami.com` });
  await page.goto('/');
  await helpers.waitForPageToBeIdle();
}

test.describe('Paused tenant behavior', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test('paused tenant shows paused banner with reactivation CTA', async ({ page, helpers }) => {
    const data = await createPausedTenant(page, helpers);
    await setupPausedPage(page, helpers, data);

    await expect(page.getByTestId('paused-banner-subscribe-button')).toBeVisible();
    await expect(page.locator('body')).toContainText('paused');
    await expect(page.locator('body')).toContainText('read-only');
  });

  test('paused tenant blocks post creation', async ({ playwright, page, helpers }) => {
    const data = await createPausedTenant(page, helpers);
    const tenantHost = `${data.uuid}.blognami.com`;

    const apiContext = await playwright.request.newContext({
      baseURL: 'http://127.0.0.1:3000',
      extraHTTPHeaders: {
        'x-host': tenantHost,
        'cookie': data.sessionCookie
      }
    });

    const response = await apiContext.post('/_actions/admin/add_post', {
      form: { title: 'Should be blocked' }
    });

    expect(response.status()).toBe(403);

    await apiContext.dispose();
  });

  test('paused tenant public site is still readable', async ({ page, helpers }) => {
    const data = await createPausedTenant(page, helpers);
    await setupPausedPage(page, helpers, data);

    await expect(page.locator('html')).toBeVisible();
    await expect(page).toHaveURL(/\//);
  });

  test('reactivating a paused tenant removes paused banner and restores editing', async ({ page, helpers }) => {
    const data = await createPausedTenant(page, helpers);
    await setupPausedPage(page, helpers, data);

    await expect(page.getByTestId('paused-banner-subscribe-button')).toBeVisible();

    await page.request.get(`/_test/reactivate_tenant?tenantId=${data.tenantId}`);

    await page.reload();
    await helpers.waitForPageToBeIdle();

    await expect(page.getByTestId('paused-banner-subscribe-button')).not.toBeVisible();
  });
});
