import { test, expect } from '../fixtures.js';
import { setupAdminTests } from './helpers.js';
import { QUICK, STRIPE_ENABLED, IS_MULTI_TENANT } from '../constants.js';

test.describe('Admin - Stripe SaaS subscription', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  test.skip(!STRIPE_ENABLED || !IS_MULTI_TENANT, 'Requires STRIPE_API_KEY and TENANCY=multi');
  setupAdminTests();

  test('subscribing removes demo banner', async ({ page, helpers }) => {
    const subscribeButton = page.getByTestId('demo-banner-subscribe-button');
    await expect(subscribeButton).toBeVisible();

    await subscribeButton.click();
    await helpers.waitForPageToBeIdle();
    await page.getByRole('link', { name: 'Select Starter' }).click();
    await helpers.completeStripeCheckout('Admin');

    // Wait for holding page to redirect after confirming subscription
    await helpers.waitForPageToBeIdle();
    await expect(subscribeButton).not.toBeVisible();

    // Cancel subscription via UI
    await page.getByTestId('navbar').getByTestId('settings').click();
    await helpers.waitForPageToBeIdle();
    await helpers.topPopover().getByRole('link', { name: 'Manage subscription' }).click();
    await helpers.waitForPageToBeIdle();
    page.on('dialog', dialog => dialog.accept());
    await helpers.topModal().getByTestId('saas-unsubscribe').click();
    await helpers.waitForPageToBeIdle();

    // Verify demo banner returns
    await expect(subscribeButton).toBeVisible();
  });
});
