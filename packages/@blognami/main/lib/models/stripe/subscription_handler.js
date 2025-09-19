
export const SubscribableHandler = {
  initialize(stripe, subscribable) {
    this.stripe = stripe;
    this.subscribable = subscribable;
  },

  async getStripeProduct() {
    const { id } = this.subscribable;

    const { data: stripeProducts } = await this.stripe.api.products.search({
      query: `metadata['pinstripeSubscribableId']:'${id}' AND active:'true'`,
    });

    let out = stripeProducts[0];

    if (!out) {
      out = await this.stripe.api.products.create({
        name: this.subscribable.subscriptionConfig.name,
        metadata: {
          pinstripeSubscribableId: id,
          blognamiEnvironment: process.env.NODE_ENV,
        },
      });
    }

    return out;
  },

  async getStripePrices() {
    const { id: stripeProductId } = await this.getStripeProduct();

    const stripePrices = [];
    let starting_after;
    while (true) {
      const { data: currentStripePrices, has_more } =
        await this.stripe.api.prices.list({
          product: stripeProductId,
          limit: 100,
          starting_after,
        });
      stripePrices.push(...currentStripePrices);
      if (!has_more) break;
      starting_after = currentStripePrices[currentStripePrices.length - 1].id;
    }

    const { monthlyPrice, yearlyPrice, currency } =
      this.subscribable.subscriptionConfig;

    const out = {};
    const enableMonthly = monthlyPrice !== undefined;
    const enableYearly = yearlyPrice !== undefined;

    const normalizedCurrency = currency.toLowerCase();
    const stripeMonthlyPrices = stripePrices.filter(
      ({ recurring }) => recurring.interval == "month"
    );
    const normalizedMonthlyPrice = monthlyPrice ? monthlyPrice * 100 : null;

    if (enableMonthly) {
      const stripeMonthlyPrice = stripeMonthlyPrices.find(
        ({ unit_amount, currency }) =>
          unit_amount == normalizedMonthlyPrice &&
          currency == normalizedCurrency
      );
      if (stripeMonthlyPrice) {
        if (stripeMonthlyPrice.active) {
          out.monthly = stripeMonthlyPrice;
        } else {
          out.monthly = await this.stripe.api.prices.update(
            stripeMonthlyPrice.id,
            { active: true }
          );
        }
      } else {
        out.monthly = await this.stripe.api.prices.create({
          product: stripeProductId,
          currency: normalizedCurrency,
          unit_amount: normalizedMonthlyPrice,
          recurring: {
            interval: "month",
          },
        });
      }
    }

    for (const { active, unit_amount, currency, id } of stripeMonthlyPrices) {
      if (!active) continue;
      if (
        enableMonthly &&
        unit_amount == normalizedMonthlyPrice &&
        currency == normalizedCurrency
      )
        continue;
      await this.stripe.api.prices.update(id, { active: false });
    }

    const stripeYearlyPrices = stripePrices.filter(
      ({ recurring }) => recurring.interval == "year"
    );
    const normalizedYearlyPrice = yearlyPrice ? yearlyPrice * 100 : null;

    if (enableYearly) {
      const stripeYearlyPrice = stripeYearlyPrices.find(
        ({ unit_amount, currency }) =>
          unit_amount == normalizedYearlyPrice && currency == normalizedCurrency
      );
      if (stripeYearlyPrice) {
        if (stripeYearlyPrice.active) {
          out.yearly = stripeYearlyPrice;
        } else {
          out.yearly = await this.stripe.api.prices.update(
            stripeYearlyPrice.id,
            { active: true }
          );
        }
      } else {
        out.yearly = await this.stripe.api.prices.create({
          product: stripeProductId,
          currency: normalizedCurrency,
          unit_amount: normalizedYearlyPrice,
          recurring: {
            interval: "year",
          },
        });
      }
    }

    for (const { active, unit_amount, currency, id } of stripeYearlyPrices) {
      if (!active) continue;
      if (
        enableYearly &&
        unit_amount == normalizedYearlyPrice &&
        currency == normalizedCurrency
      )
        continue;
      await this.stripe.api.prices.update(id, { active: false });
    }

    return out;
  },

  async getStripeCustomer({ userId, email }) {
    const {
      data: [stripeCustomer],
    } = await this.stripe.api.customers.search({
      query: `metadata['blognamiUserId']:'${userId}'`,
    });
    if (stripeCustomer) return stripeCustomer;

    if (email)
      return await this.stripe.api.customers.create({
        email,
        metadata: {
          blognamiUserId: userId,
        },
      });
  },

  async createCheckoutSession({
    interval,
    userId,
    email,
    returnUrl = new URL(
      "/",
      this.stripe.workspace.initialParams._url
    ).toString(),
  }) {
    const stripePrices = await this.getStripePrices();
    const stripePrice = stripePrices[interval];

    if (!stripePrice) return;

    console.log({ stripePrice });

    const stripeCustomer = await this.getStripeCustomer({ userId, email });

    console.log({ stripeCustomer });

    return await this.stripe.api.checkout.sessions.create({
      success_url: returnUrl,
      customer: stripeCustomer.id,
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: {
          blognamiSubscribableId: this.subscribable.id,
          blognamiUserId: userId,
        }
      }
    });
  },

  async createStripePaymentUrl({ interval, userId, email, returnUrl }) {
    const stripeCheckoutSession = await this.createCheckoutSession({
      interval,
      userId,
      email,
      returnUrl,
    });

    return stripeCheckoutSession?.url;
  },

  async cancelSubscription({ userId }) {
    const stripeCustomer = await this.getStripeCustomer({ userId });

    if (!stripeCustomer) return;

    const subscriptions = await this.stripe.api.subscriptions.list({
      customer: stripeCustomer.id,
      status: "active",
    });

    for (const { id } of subscriptions.data) {
      await this.stripe.api.subscriptions.cancel(id);
    }
  },

  getWebhookUrl() {
    const host = this.stripe.workspace.initialParams._headers.host;
    const baseUrl = new URL("/", this.stripe.workspace.initialParams._url);
    baseUrl.protocol = "https:";
    baseUrl.host = host;
    return new URL("/_actions/guest/stripe_webhook", baseUrl);
  },

  webhookUrlIsPublicallyAccessible() {
    const { hostname } = this.getWebhookUrl();
    return !["localhost", "127.0.0.1"].includes(hostname);
  },

  async getStripeWebhookEndpoint() {
    const { id } = this.subscribable;
    const webhookUrl = this.getWebhookUrl();
    const { data: stripeWebhookEndpoints } =
      await this.stripe.api.webhookEndpoints.list();

    let out = stripeWebhookEndpoints.find(
      ({ url }) => url == webhookUrl.toString()
    );

    if (!out) {
      out = await this.stripe.api.webhookEndpoints.create({
        url: webhookUrl.toString(),
        enabled_events: [
          "customer.subscription.created",
          "customer.subscription.deleted",
        ],
        metadata: {
          blognamiEnvironment: process.env.NODE_ENV,
        },
      });

      this.stripe.update({ webhookSecret: out.secret });
    }

    return out;
  },

  async syncStripeWithSubscribable() {
    await this.getStripePrices();
    if (this.webhookUrlIsPublicallyAccessible())
      await this.getStripeWebhookEndpoint();
  },
};