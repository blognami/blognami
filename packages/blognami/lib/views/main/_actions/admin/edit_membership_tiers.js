
// export const decorators = {
//   root() {
//     const enableMonthly = this.find('input[name="enableMonthly"]');
//     const monthlyPrice = this.find('input[name="monthlyPrice"]');
//     const enableYearly = this.find('input[name="enableYearly"]');
//     const yearlyPrice = this.find('input[name="yearlyPrice"]');

//     const updateVisibility = () => {
//       monthlyPrice.parent.patch({
//         style: enableMonthly.value ? "" : "display: none;",
//       });
//       yearlyPrice.parent.patch({
//         style: enableYearly.value ? "" : "display: none;",
//       });
//     };

//     enableMonthly.on("change", updateVisibility);
//     enableYearly.on("change", updateVisibility);

//     updateVisibility();
//   },
// };

export default {
  async render() {
    const that = this;

    const fields = [];

    fields.push({ name: 'enableMonthly', watch: true });
    if (this.params.enableMonthly === 'true') {
      fields.push('monthlyPrice');
    }

    fields.push({ name: 'enableYearly', watch: true });
    if (this.params.enableYearly === 'true') {
      fields.push('yearlyPrice');
    }

    fields.push('enableFree');

    return this.renderForm(this.database.membershipTiers, {
      // class: this.cssClasses.root,

      fields,

      async validateWith(){
        const isPaid = this.enableMonthly || this.enableYearly;
        if(!this.isValidationError('general') && isPaid && !await that.membership.stripeIsConfiguredCorrectly()){
          this.setValidationError('general', that.renderHtml`Stripe must be configured to offer paid memberships - ${that.renderView('_button', {
            tagName: 'a',
            target: '_overlay',
            href: '/_actions/admin/edit_stripe',
            size: 'small',
            isPrimary: true,
            body: 'Configure stripe now',
          })}.`);
        }
      },

      async success({ enableMonthly, enableYearly }) {
        const isPaid = enableMonthly || enableYearly;
        if (isPaid) {
          await that.membership.syncWithStripe();
        }
      }
    });
  },
};
