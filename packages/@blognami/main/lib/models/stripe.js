import * as crypto from "crypto";
import { Stripe } from "stripe";

import { SubscribableHandler } from "./stripe/subscription_handler.js";

export default {
  meta() {
    this.include("singleton");

    this.on("before:insert", function () {
      if (this.webhookSecret) return;
      this.webhookSecret = crypto.randomUUID();
    });

    this.on("syncWithSubscribable", async (stripe, subscribable) => {
      if(!await stripe.isConfiguredCorrectly()) return;
      await stripe
        .delegateTo(subscribable, SubscribableHandler)
        .syncStripeWithSubscribable();
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
  }) {
    const subscribable = await this.database.subscribables
      .where({ id: subscribableId })
      .first();
    if (!subscribable) return;
    return this.delegateTo(
      subscribable,
      SubscribableHandler
    ).createStripePaymentUrl({ interval, userId, email, returnUrl });
  },

  async cancelSubscription({ subscribableId, userId }) {
    const subscribable = await this.database.subscribables
      .where({ id: subscribableId })
      .first();
    if (!subscribable) return;
    return this.delegateTo(
      subscribable,
      SubscribableHandler
    ).cancelSubscription({ userId });
  },
};
