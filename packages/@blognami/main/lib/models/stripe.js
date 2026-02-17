import * as crypto from "crypto";
import { Stripe } from "stripe";

export default {
  meta() {
    this.include("singleton");

    this.addHook("beforeInsert", function () {
      if (this.webhookSecret) return;
      this.webhookSecret = crypto.randomUUID();
    });

    this.addHook("syncWithSubscribable", async function (subscribable){
      if(!await this.isConfiguredCorrectly()) return;
      await this.syncStripeWithSubscribable(subscribable);
    });
  },

  get api() {
    return this.workspace.defer(() => {
      const create = (secretKey) =>
        Object.assign(new Stripe(secretKey), {
          withSecretKey(secretKey) {
            return create(secretKey);
          },
        });

      return create(this.secretKey);
    });
  },

  async isConfiguredCorrectly() {
    try {
      await this.api.products.list({
        limit: 1,
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async createSubscribeUrl({
    subscribableId,
    interval,
    userId,
    email,
    returnUrl,
    plan,
  }) {
    const subscribable = await this.database.subscribables
      .where({ id: subscribableId })
      .first();
    if (!subscribable) return;

    const stripeCheckoutSession = await this.createCheckoutSession(subscribable, {
      interval,
      userId,
      email,
      returnUrl,
      plan,
    });

    return stripeCheckoutSession?.url;
  },

  async cancelSubscription({ subscribableId, userId }) {
    const subscribable = await this.database.subscribables
      .where({ id: subscribableId })
      .first();
    if (!subscribable) return;

    const stripeCustomer = await this.getStripeCustomer({ userId });

    if (!stripeCustomer) return;

    const subscriptions = await this.api.subscriptions.list({
      customer: stripeCustomer.id,
      status: "active",
    });

    for (const { id } of subscriptions.data) {
      await this.api.subscriptions.cancel(id);
    }
  },

  async updateSubscriptionPlan({ subscribableId, userId, plan, interval }) {
    const subscribable = await this.database.subscribables
      .where({ id: subscribableId })
      .first();
    if (!subscribable) return;

    const stripeCustomer = await this.getStripeCustomer({ userId });
    if (!stripeCustomer) return;

    const subscriptions = await this.api.subscriptions.list({
      customer: stripeCustomer.id,
      status: "active",
    });

    if (subscriptions.data.length === 0) return;

    const subscription = subscriptions.data[0];

    const stripePrices = await this.getStripePrices(subscribable, plan);
    const newPrice = stripePrices[interval];

    if (!newPrice) {
      throw new Error(`No price found for plan "${plan}" with interval "${interval}"`);
    }

    const planItem = subscription.items.data[0];

    if (!planItem) {
      throw new Error('Could not find plan item in subscription');
    }

    await this.api.subscriptions.update(subscription.id, {
      items: [{
        id: planItem.id,
        price: newPrice.id,
      }],
      metadata: {
        ...subscription.metadata,
        blognamiPlan: plan,
      }
    });
  },

  async getStripeProduct(subscribable, planName = null) {
    const config = subscribable.subscriptionConfig;

    if (config.plans && planName) {
      const planConfig = config.plans[planName];
      if (!planConfig) {
        throw new Error(`Plan "${planName}" not found in subscriptionConfig.plans`);
      }

      const existingRecord = await this.database.stripeProducts
        .where({ name: planName, type: 'plan' }).first();

      if (existingRecord) {
        return await this.api.products.retrieve(existingRecord.stripeProductId);
      }

      const stripeProduct = await this.api.products.create({
        name: planConfig.name,
        metadata: {
          blognamiEnvironment: process.env.NODE_ENV,
          blognamiPlanName: planName,
        },
      });

      await this.database.stripeProducts.insert({
        name: planName,
        type: 'plan',
        stripeProductId: stripeProduct.id,
      });

      return stripeProduct;
    }

    let stripeProductId = await subscribable.stripeProductId;

    if (stripeProductId) {
      return await this.api.products.retrieve(stripeProductId);
    }

    const stripeProduct = await this.api.products.create({
      name: config.name,
      metadata: {
        blognamiEnvironment: process.env.NODE_ENV,
      },
    });

    await subscribable.update({ stripeProductId: stripeProduct.id });

    return stripeProduct;
  },

  async getStripePrices(subscribable, planName = null) {
    const config = subscribable.subscriptionConfig;

    let monthlyPrice, yearlyPrice, currency;
    if (config.plans && planName) {
      const planConfig = config.plans[planName];
      if (!planConfig) {
        throw new Error(`Plan "${planName}" not found in subscriptionConfig.plans`);
      }
      monthlyPrice = planConfig.monthlyPrice;
      yearlyPrice = planConfig.yearlyPrice;
      currency = planConfig.currency || 'USD';
    } else {
      monthlyPrice = config.monthlyPrice;
      yearlyPrice = config.yearlyPrice;
      currency = config.currency || 'USD';
    }

    const { id: stripeProductId } = await this.getStripeProduct(subscribable, planName);

    const stripePrices = [];
    let starting_after;
    while (true) {
      const { data: currentStripePrices, has_more } =
        await this.api.prices.list({
          product: stripeProductId,
          limit: 100,
          starting_after,
        });
      stripePrices.push(...currentStripePrices);
      if (!has_more) break;
      starting_after = currentStripePrices[currentStripePrices.length - 1].id;
    }

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
          out.monthly = await this.api.prices.update(
            stripeMonthlyPrice.id,
            { active: true }
          );
        }
      } else {
        out.monthly = await this.api.prices.create({
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
      await this.api.prices.update(id, { active: false });
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
          out.yearly = await this.api.prices.update(
            stripeYearlyPrice.id,
            { active: true }
          );
        }
      } else {
        out.yearly = await this.api.prices.create({
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
      await this.api.prices.update(id, { active: false });
    }

    return out;
  },

  async getStripeCustomer({ userId, email }) {
    const user = await this.database.users.where({ id: userId }).first();
    if (!user) return;

    if (user.stripeCustomerId) {
      return await this.api.customers.retrieve(user.stripeCustomerId);
    }

    if (email) {
      const stripeCustomer = await this.api.customers.create({
        email,
        metadata: {
          blognamiUserId: userId,
        },
      });
      await user.update({ stripeCustomerId: stripeCustomer.id });
      return stripeCustomer;
    }
  },

  async createCheckoutSession(subscribable, {
    interval,
    userId,
    email,
    returnUrl = new URL(
      "/",
      this.workspace.initialParams._url
    ).toString(),
    plan = null,
  }) {
    const stripePrices = await this.getStripePrices(subscribable, plan);
    const stripePrice = stripePrices[interval];

    if (!stripePrice) return;

    const stripeCustomer = await this.getStripeCustomer({ userId, email });

    const metadata = {
      blognamiSubscribableId: subscribable.id,
      blognamiUserId: userId,
    };

    if (plan) {
      metadata.blognamiPlan = plan;
    }

    if (interval) {
      metadata.blognamiInterval = interval;
    }

    return await this.api.checkout.sessions.create({
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
        metadata
      }
    });
  },

  getWebhookUrl() {
    const host = this.workspace.initialParams._headers.host;
    const baseUrl = new URL("/", this.workspace.initialParams._url);
    baseUrl.protocol = "https:";
    baseUrl.host = host;
    return new URL("/_actions/guest/stripe_webhook", baseUrl);
  },

  webhookUrlIsPublicallyAccessible() {
    const { hostname } = this.getWebhookUrl();
    return !["localhost", "127.0.0.1"].includes(hostname);
  },

  async getStripeWebhookEndpoint() {
    const webhookUrl = this.getWebhookUrl();
    const { data: stripeWebhookEndpoints } =
      await this.api.webhookEndpoints.list();

    let out = stripeWebhookEndpoints.find(
      ({ url }) => url == webhookUrl.toString()
    );

    if (!out) {
      out = await this.api.webhookEndpoints.create({
        url: webhookUrl.toString(),
        enabled_events: [
          "customer.subscription.created",
          "customer.subscription.deleted",
        ],
        metadata: {
          blognamiEnvironment: process.env.NODE_ENV,
        },
      });

      this.update({ webhookSecret: out.secret });
    }

    return out;
  },

  async syncStripeWithSubscribable(subscribable) {
    const config = subscribable.subscriptionConfig || {};

    if (config.plans) {
      for (const planName of Object.keys(config.plans)) {
        const planConfig = config.plans[planName];
        if (planConfig.monthlyPrice !== undefined || planConfig.yearlyPrice !== undefined) {
          await this.getStripePrices(subscribable, planName);
        }
      }
    } else {
      const { monthlyPrice, yearlyPrice } = config;
      if (monthlyPrice === undefined && yearlyPrice === undefined) return;
      await this.getStripePrices(subscribable);
    }

    if (this.webhookUrlIsPublicallyAccessible())
      await this.getStripeWebhookEndpoint();
  },
};
