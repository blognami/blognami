import { test, expect } from '../fixtures.js';
import { setupGuestTests } from './helpers.js';
import { QUICK, STRIPE_ENABLED } from '../constants.js';

const PUBLIC_MESSAGE = 'Enjoy this post? Subscribe to get new posts straight to your inbox.';
const FREE_MESSAGE = 'This post is for members. Sign up free to keep reading.';
const PAID_MESSAGE = 'This post is for paid members. Upgrade to keep reading.';
const UPGRADE_MESSAGE = "You're on the free plan — upgrade for full access to everything.";

// Enabling a paid tier is only possible when Stripe is configured, so the
// paid-tier legs of the audience matrix are gated on STRIPE_ENABLED below.
async function enableMonthlyTier({ page, helpers }){
  await page.getByTestId('navbar').getByTestId('settings').click();
  await helpers.topPopover().getByTestId('edit-site-membership').click();
  await helpers.submitForm({ enableMonthly: true, monthlyPrice: '5' });
}

async function setPostAccess({ page, helpers }, slug, access){
  await page.goto(`/${slug}`);
  await helpers.waitForPageToBeIdle();
  await page.getByTestId('main').getByTestId('tab-meta').click();
  await page.getByTestId('main').getByTestId('edit-post-meta').click();
  await helpers.submitForm({ access });
}

async function signUpAs({ page, helpers }, email, name){
  await page.getByTestId('navbar').getByTestId('sign-in').click();
  await helpers.submitForm({ email, legal: true });
  await helpers.submitForm({ password: email });
  await helpers.submitForm({ name });
  await helpers.waitForPageToBeIdle();
}

test.describe('Guest - End-of-post subscription CTA', () => {
  test.skip(QUICK, 'Skipped in quick mode');
  setupGuestTests();

  test('guest sees the subscribe variant on public and free-gated posts', async ({ page, helpers }) => {
    // Admin gates one post to members only, leaving /amber-trail public
    await helpers.signIn('admin@example.com');
    await setPostAccess({ page, helpers }, 'altenwerth-ford', 'free');
    await helpers.signOut();

    // Public post: CTA appears below the full content
    await page.goto('/amber-trail');
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId('post-body')).toBeVisible();
    await expect(page.locator('div:has([data-test-id="post-body"]) + aside')).toContainText(PUBLIC_MESSAGE);
    await expect(page.getByTestId('subscribe-now-button')).toBeVisible();

    // Free-gated post: CTA replaces the withheld body
    await page.goto('/altenwerth-ford');
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId('post-body')).not.toBeVisible();
    await expect(page.getByText(FREE_MESSAGE)).toBeVisible();
    await expect(page.getByTestId('subscribe-now-button')).toBeVisible();
  });

  test('clicking the CTA on a public post as a guest opens the subscribe flow overlay', async ({ page, helpers }) => {
    await page.goto('/amber-trail');
    await helpers.waitForPageToBeIdle();
    await page.getByTestId('subscribe-now-button').click();
    await helpers.waitForPageToBeIdle();

    // Guests are routed through the existing passwordless sign-in first
    await expect(helpers.topModal()).toContainText('Subscribe');
    await helpers.submitForm({ email: 'bob@example.com', legal: true });
    await helpers.submitForm({ password: 'bob@example.com' });
    await helpers.submitForm({ name: 'Bob' });
    await helpers.waitForPageToBeIdle();

    // With only the free tier enabled the flow subscribes immediately; the
    // page reloads and the CTA disappears (free subscriber, no paid tier)
    await expect(page.getByTestId('post-body')).toBeVisible();
    await expect(page.getByTestId('subscribe-now-button')).toHaveCount(0);
  });

  test('admin sees no end-of-post CTA on public or free-gated posts', async ({ page, helpers }) => {
    await helpers.signIn('admin@example.com');
    await setPostAccess({ page, helpers }, 'altenwerth-ford', 'free');

    for (const slug of ['amber-trail', 'altenwerth-ford']) {
      await page.goto(`/${slug}`);
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId('post-body')).toBeVisible();
      await expect(page.getByTestId('subscribe-now-button')).toHaveCount(0);
      await expect(page.getByText(PUBLIC_MESSAGE)).toHaveCount(0);
    }
  });

  test('guest sees the paid variant on a paid-gated post', async ({ page, helpers }) => {
    test.skip(!STRIPE_ENABLED, 'STRIPE_API_KEY not configured');

    await helpers.signIn('admin@example.com');
    await enableMonthlyTier({ page, helpers });
    await setPostAccess({ page, helpers }, 'alexandra-burgs', 'paid');
    await helpers.signOut();

    await page.goto('/alexandra-burgs');
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId('post-body')).not.toBeVisible();
    await expect(page.getByText(PAID_MESSAGE)).toBeVisible();
    await expect(page.getByTestId('subscribe-now-button')).toBeVisible();
  });

  test('free subscriber sees the upgrade variant across public, free and paid posts', async ({ page, helpers }) => {
    test.skip(!STRIPE_ENABLED, 'STRIPE_API_KEY not configured');

    await helpers.signIn('admin@example.com');
    await enableMonthlyTier({ page, helpers });
    await setPostAccess({ page, helpers }, 'altenwerth-ford', 'free');
    await setPostAccess({ page, helpers }, 'alexandra-burgs', 'paid');
    await helpers.signOut();

    await signUpAs({ page, helpers }, 'bob@example.com', 'Bob');

    // Subscribe on the free plan via the end-of-post CTA's plan picker
    await page.goto('/amber-trail');
    await helpers.waitForPageToBeIdle();
    await page.getByTestId('subscribe-now-button').click();
    await helpers.waitForPageToBeIdle();
    await expect(helpers.topModal()).toContainText('Choose a subscription plan');
    await helpers.topModal().getByTestId('none-subscription-button').click();
    await helpers.waitForPageToBeIdle();

    // Public post: full content plus the upgrade CTA below it
    await expect(page.getByTestId('post-body')).toBeVisible();
    await expect(page.locator('div:has([data-test-id="post-body"]) + aside')).toContainText(UPGRADE_MESSAGE);
    await expect(page.getByTestId('subscribe-now-button')).toContainText('Upgrade now');

    // Free-gated post: accessible, with the upgrade CTA below the content
    await page.goto('/altenwerth-ford');
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId('post-body')).toBeVisible();
    await expect(page.getByText(UPGRADE_MESSAGE)).toBeVisible();

    // Paid-gated post: body withheld, paid-gate wording with an upgrade button
    await page.goto('/alexandra-burgs');
    await helpers.waitForPageToBeIdle();
    await expect(page.getByTestId('post-body')).not.toBeVisible();
    await expect(page.getByText(PAID_MESSAGE)).toBeVisible();
    await expect(page.getByTestId('subscribe-now-button')).toContainText('Upgrade now');
  });

  test('paid subscriber sees no end-of-post CTA on public, free or paid posts', async ({ page, helpers }) => {
    test.skip(!STRIPE_ENABLED, 'STRIPE_API_KEY not configured');

    await helpers.signIn('admin@example.com');
    await enableMonthlyTier({ page, helpers });
    await setPostAccess({ page, helpers }, 'altenwerth-ford', 'free');
    await setPostAccess({ page, helpers }, 'alexandra-burgs', 'paid');
    await helpers.signOut();

    // Subscribe to the monthly plan via the paid post's CTA
    await page.goto('/alexandra-burgs');
    await helpers.waitForPageToBeIdle();
    await page.getByTestId('subscribe-now-button').click();
    await helpers.waitForPageToBeIdle();
    await helpers.submitForm({ email: 'subscriber@example.com', legal: true });
    await helpers.submitForm({ password: 'subscriber@example.com' });
    await helpers.submitForm({ name: 'Test Subscriber' });
    await helpers.waitForPageToBeIdle();
    await page.getByTestId('monthly-subscription-button').click();
    await helpers.completeStripeCheckout('Test Subscriber');
    await helpers.waitForPageToBeIdle();

    // Paid, free and public posts are all fully accessible with no CTA
    for (const slug of ['alexandra-burgs', 'altenwerth-ford', 'amber-trail']) {
      await page.goto(`/${slug}`);
      await helpers.waitForPageToBeIdle();
      await expect(page.getByTestId('post-body')).toBeVisible();
      await expect(page.getByTestId('subscribe-now-button')).toHaveCount(0);
      await expect(page.getByText(UPGRADE_MESSAGE)).toHaveCount(0);
    }

    // Cancel the Stripe subscription so no state leaks beyond the database reset
    page.on('dialog', dialog => dialog.accept());
    await page.getByTestId('navbar').getByTestId('your-account').click();
    await helpers.waitForPageToBeIdle();
    await helpers.topPopover().getByTestId('unsubscribe').click();
    await helpers.waitForPageToBeIdle();
  });
});
