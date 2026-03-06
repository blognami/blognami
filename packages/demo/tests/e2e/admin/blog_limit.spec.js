import { test, expect } from '../fixtures.js';
import { IS_MULTI_TENANT } from '../constants.js';

const PORTAL_BASE = 'http://127.0.0.1:3001';

async function signInToPortal(playwright, email) {
  const ctx = await playwright.request.newContext({
    baseURL: PORTAL_BASE
  });

  const otpResponse = await ctx.get(`/_test/generate_otp?email=${encodeURIComponent(email)}`);
  const { otp } = await otpResponse.json();

  await ctx.post('/_actions/guest/sign_in', {
    form: { email, legal: 'true' }
  });

  const step2Response = await ctx.post(`/_actions/guest/sign_in/verify_password?email=${encodeURIComponent(email)}`, {
    form: { password: otp }
  });

  const setCookieHeader = step2Response.headers()['set-cookie'] || '';
  const match = setCookieHeader.match(/pinstripeSession=[^;]+/);
  const sessionCookie = match ? match[0] : '';

  await ctx.dispose();
  return sessionCookie;
}

async function addBlogViaApi(playwright, sessionCookie, title) {
  const ctx = await playwright.request.newContext({
    baseURL: PORTAL_BASE,
    extraHTTPHeaders: {
      'cookie': sessionCookie,
      'accept': 'text/html'
    }
  });

  const response = await ctx.post('/_actions/user/add_blog', {
    form: { title }
  });

  const body = await response.text();
  await ctx.dispose();
  return body;
}

test.describe('Blog limit per email', () => {
  test.skip(!IS_MULTI_TENANT, 'Requires TENANCY=multi');

  test.afterEach(async ({ page, helpers }) => {
    await page.setExtraHTTPHeaders({});
    await helpers.resetDatabaseFromSql();
  });

  test('4th blog creation is rejected when email already has 3 blogs', async ({ playwright }) => {
    // The seed database already creates 3 tenants with admin@example.com:
    //   1. lorum-ipsum.blognami.com
    //   2. blognami.com (portal)
    //   3. 00000000-0000-0000-0000-000000000000.blognami.com
    // So attempting to add another blog should hit the 3-blog limit.

    const sessionCookie = await signInToPortal(playwright, 'admin@example.com');
    const responseBody = await addBlogViaApi(playwright, sessionCookie, 'Fourth Blog');

    expect(responseBody).toContain('You have reached the maximum of 3 blogs per account.');
  });
});
