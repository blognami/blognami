import { test, expect } from '../fixtures.js';
import { setupGuestTests } from './helpers.js';
import { QUICK, STRIPE_ENABLED } from '../constants.js';

// Enabling a paid tier is only possible when Stripe is configured, so the
// paid-tier legs (upgrade wording, paid-subscriber absence) are gated on
// STRIPE_ENABLED below.
async function enableMonthlyTier({ page, helpers }){
  await page.getByTestId('navbar').getByTestId('settings').click();
  await helpers.topPopover().getByTestId('edit-site-membership').click();
  await helpers.submitForm({ enableMonthly: true, monthlyPrice: '5' });
  // saving triggers an async page reload — settle it with an explicit
  // navigation so subsequent navbar clicks don't race against it
  await page.goto('/');
  await helpers.waitForPageToBeIdle();
}

async function gotoTagPage({ page, helpers }){
  await page.getByTestId('sidebar').getByText('Excepturi Corporis').click();
  await helpers.waitForPageToBeIdle();
  await expect(page.getByTestId('main').locator('h2').first()).toContainText('Excepturi Corporis');
}

// Signs out without driving the navbar popover, whose clicks can race
// against the page reload triggered by a preceding form save
async function signOutDirectly({ page, helpers }){
  await page.request.get('/_actions/guest/sign_out');
  await page.goto('/');
  await helpers.waitForPageToBeIdle();
}

function subscribeMenuItem(page){
  return page.getByTestId('navbar').getByTestId('subscribe');
}

test.describe('Guest - Subscribe menu item', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupGuestTests();

  test('guest sees the subscribe menu item on the home, post and tag pages', async ({ page, helpers }) => {
    // Home page (loaded by the beforeEach)
    await expect(subscribeMenuItem(page)).toHaveText('Subscribe');

    // Post page
    await page.goto('/amber-trail');
    await helpers.waitForPageToBeIdle();
    await expect(subscribeMenuItem(page)).toHaveText('Subscribe');

    // Tag page
    await page.goto('/');
    await helpers.waitForPageToBeIdle();
    await gotoTagPage({ page, helpers });
    await expect(subscribeMenuItem(page)).toHaveText('Subscribe');
  });

  test('clicking the subscribe menu item as a guest opens the subscribe flow overlay', async ({ page, helpers }) => {
    await subscribeMenuItem(page).click();
    await helpers.waitForPageToBeIdle();

    // Guests are routed through the existing passwordless sign-in first
    await expect(helpers.topModal()).toContainText('Subscribe');
    await helpers.submitForm({ email: 'bob@example.com', legal: true });
    await helpers.submitForm({ password: 'bob@example.com' });
    await helpers.submitForm({ name: 'Bob' });
    await helpers.waitForPageToBeIdle();

    // With only the free tier enabled the flow subscribes immediately; the
    // page reloads and the menu item disappears (free subscriber, no paid tier)
    await expect(subscribeMenuItem(page)).toHaveCount(0);
  });

  test('admin sees no subscribe menu item on the home, post or tag pages', async ({ page, helpers }) => {
    await helpers.signIn('admin@example.com');
    await helpers.waitForPageToBeIdle();
    await expect(subscribeMenuItem(page)).toHaveCount(0);

    await page.goto('/amber-trail');
    await helpers.waitForPageToBeIdle();
    await expect(subscribeMenuItem(page)).toHaveCount(0);

    await page.goto('/');
    await helpers.waitForPageToBeIdle();
    await gotoTagPage({ page, helpers });
    await expect(subscribeMenuItem(page)).toHaveCount(0);
  });

  test('guest reaches the plan picker via the subscribe menu item and sees upgrade wording as a free subscriber', async ({ page, helpers }) => {
    test.skip(!STRIPE_ENABLED, 'STRIPE_API_KEY not configured');

    await helpers.signIn('admin@example.com');
    await enableMonthlyTier({ page, helpers });
    await signOutDirectly({ page, helpers });

    // Guest clicks the menu item: sign-in first, then the plan picker overlay
    await subscribeMenuItem(page).click();
    await helpers.waitForPageToBeIdle();
    await expect(helpers.topModal()).toContainText('Subscribe');
    await helpers.submitForm({ email: 'bob@example.com', legal: true });
    await helpers.submitForm({ password: 'bob@example.com' });
    await helpers.submitForm({ name: 'Bob' });
    await helpers.waitForPageToBeIdle();
    await expect(helpers.topModal()).toContainText('Choose a subscription plan');
    await helpers.topModal().getByTestId('none-subscription-button').click();
    await helpers.waitForPageToBeIdle();

    // Free subscriber with a paid tier enabled: upgrade wording everywhere
    await expect(subscribeMenuItem(page)).toHaveText('Upgrade');

    await page.goto('/amber-trail');
    await helpers.waitForPageToBeIdle();
    await expect(subscribeMenuItem(page)).toHaveText('Upgrade');

    await page.goto('/');
    await helpers.waitForPageToBeIdle();
    await gotoTagPage({ page, helpers });
    await expect(subscribeMenuItem(page)).toHaveText('Upgrade');
  });

  test('paid subscriber sees no subscribe menu item on the home, post or tag pages', async ({ page, helpers }) => {
    test.skip(!STRIPE_ENABLED, 'STRIPE_API_KEY not configured');

    await helpers.signIn('admin@example.com');
    await enableMonthlyTier({ page, helpers });
    await signOutDirectly({ page, helpers });

    // Subscribe to the monthly plan via the menu item's plan picker
    await subscribeMenuItem(page).click();
    await helpers.waitForPageToBeIdle();
    await helpers.submitForm({ email: 'subscriber@example.com', legal: true });
    await helpers.submitForm({ password: 'subscriber@example.com' });
    await helpers.submitForm({ name: 'Test Subscriber' });
    await helpers.waitForPageToBeIdle();
    await page.getByTestId('monthly-subscription-button').click();
    await helpers.completeStripeCheckout('Test Subscriber');
    await helpers.waitForPageToBeIdle();

    await expect(subscribeMenuItem(page)).toHaveCount(0);

    await page.goto('/amber-trail');
    await helpers.waitForPageToBeIdle();
    await expect(subscribeMenuItem(page)).toHaveCount(0);

    await page.goto('/');
    await helpers.waitForPageToBeIdle();
    await gotoTagPage({ page, helpers });
    await expect(subscribeMenuItem(page)).toHaveCount(0);

    // Cancel the Stripe subscription so no state leaks beyond the database reset
    page.on('dialog', dialog => dialog.accept());
    await page.getByTestId('navbar').getByTestId('your-account').click();
    await helpers.waitForPageToBeIdle();
    await helpers.topPopover().getByTestId('unsubscribe').click();
    await helpers.waitForPageToBeIdle();
  });
});
