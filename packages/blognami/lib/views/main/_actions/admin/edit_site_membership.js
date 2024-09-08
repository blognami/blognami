export const decorators = {
  root() {
    const enableMonthly = this.find('input[name="enableMonthly"]');
    const monthlyPrice = this.find('input[name="monthlyPrice"]');
    const enableYearly = this.find('input[name="enableYearly"]');
    const yearlyPrice = this.find('input[name="yearlyPrice"]');
    const stripeSecretKey = this.find('input[name="stripeSecretKey"]');

    const updateVisibility = () => {
      monthlyPrice.parent.patch({
        style: enableMonthly.value ? "" : "display: none;",
      });
      yearlyPrice.parent.patch({
        style: enableYearly.value ? "" : "display: none;",
      });
      stripeSecretKey.parent.patch({
        style: enableMonthly.value || enableYearly.value ? "" : "display: none;",
      });
    };

    enableMonthly.on("change", updateVisibility);
    enableYearly.on("change", updateVisibility);

    updateVisibility();
  },
};

export default {
  async render() {
    const {
      enableMonthly,
      monthlyPrice,
      enableYearly,
      yearlyPrice,
      enableFree,
    } = await this.database.membershipTiers;
    const { secretKey: stripeSecretKey } = await this.database.stripe;

    const model = this.createModel({
      meta() {
        this.mustNotBeBlank("monthlyPrice", {
          when: ({ enableMonthly }) => enableMonthly == 'true',
        });
        this.mustNotBeBlank("yearlyPrice", {
          when: ({ enableYearly }) => enableYearly == 'true',
        });
        this.mustNotBeBlank("stripeSecretKey", {
          when: ({ enableMonthly, enableYearly }) => enableMonthly == 'true' || enableYearly == 'true',
        });
      },

      enableMonthly,

      monthlyPrice,

      enableYearly,

      yearlyPrice,

      enableFree,

      stripeSecretKey,
    });

    return this.renderForm(model, {
      class: this.cssClasses.root,

      title: "Edit membership",

      fields: [
        { name: "enableMonthly", type: "checkbox" },
        "monthlyPrice",
        { name: "enableYearly", type: "checkbox" },
        "yearlyPrice",
        { name: "enableFree", type: "checkbox" },
        { name: "stripeSecretKey", type: "password" },
      ],
    });
  },
};
