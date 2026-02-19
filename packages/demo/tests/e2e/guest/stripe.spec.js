import { test, expect } from '../fixtures.js';
import { setupGuestTests } from './helpers.js';
import { QUICK, STRIPE_ENABLED } from '../constants.js';

test.describe('Guest - Stripe newsletter subscription', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  test.skip(!STRIPE_ENABLED, 'STRIPE_API_KEY not configured');
  setupGuestTests();

  test('paid post becomes accessible after subscription', async ({ page, helpers }) => {
    // Sign in as admin to set up paid content
    await helpers.signIn('admin@example.com');

    // Navigate to settings and enable monthly subscription
    await page.getByTestId('navbar').getByTestId('settings').click();
    await helpers.topPopover().getByTestId('edit-site-membership').click();
    await helpers.submitForm({ enableMonthly: true, monthlyPrice: '5' });

    // Set a post to paid access
    await page.getByTestId("main").getByText("Alexandra Burgs").click();
    await helpers.waitForPageToBeIdle();
    await page.getByTestId("main").getByTestId("edit-post-meta").click();
    await helpers.submitForm({ access: 'paid' });

    // Sign out and verify content is restricted
    await helpers.signOut();
    await page.goto('/alexandra-burgs');
    await helpers.waitForPageToBeIdle();
    await expect(page.getByText('This content is for paying subscribers only.')).toBeVisible();
    await expect(page.getByTestId('post-body')).not.toBeVisible();

    // Subscribe via Stripe
    await page.getByTestId('subscribe-now-button').click();
    await helpers.waitForPageToBeIdle();
    await page.getByTestId('monthly-subscription-button').click();
    await helpers.waitForPageToBeIdle();
    await helpers.submitForm({ email: 'subscriber@example.com', legal: true });
    await helpers.submitForm({ password: 'subscriber@example.com' });
    await helpers.submitForm({ name: 'Test Subscriber' }, { skipWaitForIdle: true });
    await helpers.completeStripeCheckout('Test Subscriber');

    // Wait for holding page to redirect after confirming subscription
    await helpers.waitForPageToBeIdle();
    await expect(page.getByText('This content is for paying subscribers only.')).not.toBeVisible();
    await expect(page.getByTestId('post-body')).toBeVisible();

    // Cancel subscription via UI
    page.on('dialog', dialog => dialog.accept());
    await page.getByTestId('navbar').getByTestId('your-account').click();
    await helpers.waitForPageToBeIdle();
    await helpers.topPopover().getByTestId('unsubscribe').click();
    await helpers.waitForPageToBeIdle();

    // Navigate back to paid post and verify access is revoked
    await page.getByTestId('main').getByText('Alexandra Burgs').click();
    await helpers.waitForPageToBeIdle();
    await expect(page.getByText('This content is for paying subscribers only.')).toBeVisible();
    await expect(page.getByTestId('post-body')).not.toBeVisible();
  });
});
