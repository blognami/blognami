
export default {
  async render() {
    const that = this;

    const membershipTiers = await this.database.membershipTiers;

    const fields = [];

    fields.push({ name: 'enableMonthly', watch: true });
    if (this.params.enableMonthly === 'true' || (this.params._method == 'GET' && membershipTiers.enableMonthly)) {
      fields.push('monthlyPrice');
    }

    fields.push({ name: 'enableYearly', watch: true });
    if (this.params.enableYearly === 'true' || (this.params._method == 'GET' && membershipTiers.enableYearly)) {
      fields.push('yearlyPrice');
    }

    if (this.params.enableMonthly === 'true' || this.params.enableYearly === 'true') {
      const options = this.currency.list.reduce(
        (out, { name, isoCode } ) => ({ ...out, [isoCode]: `${isoCode} - ${name}` }),
        {}
      );
      fields.push({ name: 'currency', type: 'select', options });
    }

    fields.push('enableFree');

    return this.renderForm(membershipTiers, {
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
