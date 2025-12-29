import { test as base, expect } from '@playwright/test';

class PageHelpers {
  constructor(page) {
    this.page = page;
  }

  async resetDatabaseFromSql() {
    const response = await this.page.request.get('/_test/reset_database_from_sql');
    return response;
  }

  async signIn(email) {
    await this.page.getByTestId('navbar').getByTestId('sign-in').click();
    await this.submitForm({ email, legal: true });
    await this.submitForm({ password: email });
  }

  async signOut() {
    await this.page.getByTestId('navbar').getByTestId("your-account").click();
    await this.page.getByTestId('sign-out').click();
    await this.waitForPageToBeIdle();
  }

  async submitForm(values = {}, options = {}) {
    const form = this.topModal().locator('form');

    for (const [name, value] of Object.entries(values)) {
      const input = form.locator(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);
      const tagName = await input.evaluate(el => el.tagName.toLowerCase());
      const isSelect = tagName === 'select';
      const inputType = isSelect ? null : await input.getAttribute('type');
      const isCheckbox = inputType === 'checkbox';
      const isPassword = inputType === 'password';
      const isMarkdown = await input.getAttribute('data-test-id') === 'markdown-input';

      if (isSelect) {
        await input.selectOption(value);
      } else if (isPassword) {
        await input.clear();
        await this.typeOtpFor(input, value);
      } else if (isCheckbox) {
        if (value) {
          await input.check();
        } else {
          await input.uncheck();
        }
      } else if (isMarkdown) {
        await input.click();
        await this.waitForPageToBeIdle();
        await this.page.keyboard.press(process.platform === 'darwin' ? 'Meta+a' : 'Control+a');
        await this.page.keyboard.type(value);
        await this.waitForPageToBeIdle();
        await this.closeTopModal();
        await expect(input).toHaveValue(value);
      } else {
        await input.clear();
        await input.fill(value);
      }
    }
    
    await form.locator('button[type="submit"]').click();
    if(!options.skipWaitForIdle) await this.waitForPageToBeIdle();
  }

  async typeOtpFor(input, email) {
    const response = await this.page.request.get(`/_test/generate_otp?email=${encodeURIComponent(email)}`);
    const { otp } = await response.json();
    await input.fill(otp);
  }

  topModal() {
    return this.page.locator('html.idle pinstripe-modal').last();
  }

  topPopover() {
    return this.page.locator('html.idle pinstripe-popover').last();
  }

  async closeTopModal() {
    const modal = this.topModal();
    await modal.locator('.container button').first().click();
    await expect(modal).not.toBeVisible();
  }

  async waitForPageToBeIdle() {
    await this.page.waitForTimeout(100); // Small delay to allow state changes
    await this.page.locator('html.idle').waitFor();
  }

  async completeStripeCheckout(billingName) {
    await this.page.waitForURL(/checkout\.stripe\.com/);
    await this.page.locator('[name="enableStripePass"]').uncheck();
    await this.page.locator('[name="cardNumber"]').fill('4242424242424242');
    await this.page.locator('[name="cardExpiry"]').fill('12/34');
    await this.page.locator('[name="cardCvc"]').fill('123');
    await this.page.locator('[name="billingName"]').fill(billingName);
    await this.page.locator('[name="billingPostalCode"]').fill('12345');
    await this.page.getByRole('button', { name: /subscribe|pay/i }).click();

    await this.page.waitForURL(/127\.0\.0\.1:3000/, { timeout: 60000 });
    await this.waitForPageToBeIdle();
  }
}

/**
 * Custom test fixtures
 */
export const test = base.extend({
  helpers: async ({ page }, use) => {
    const helpers = new PageHelpers(page);
    
    // Set up persistent context flag and override window.confirm
    await page.addInitScript(() => {
      window.isPersistentContext = true;
      
      // Override window.confirm to always return true
      window.confirm = () => true;
    });

    await use(helpers);
  },
});

export { expect };