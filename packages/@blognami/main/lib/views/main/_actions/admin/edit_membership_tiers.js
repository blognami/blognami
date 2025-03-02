
export default {
  async render() {
    const that = this;

    const membershipTiers = await this.database.membershipTiers;
    const wasPaid = membershipTiers.enableMonthly || membershipTiers.enableYearly;

    const enableMonthly = this.params._method == 'GET' ? membershipTiers.enableMonthly : this.params.enableMonthly == 'true';
    const enableYearly = this.params._method == 'GET' ? membershipTiers.enableYearly : this.params.enableYearly == 'true';

    const fields = [];

    fields.push({ name: 'enableMonthly', watch: true });
    if (enableMonthly) {
      fields.push('monthlyPrice');
    }

    fields.push({ name: 'enableYearly', watch: true });
    if (enableYearly) {
      fields.push('yearlyPrice');
    }

    if (enableMonthly || enableYearly) {
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
        if (isPaid || wasPaid) {
          await that.membership.syncWithStripe();
        }
      }
    });
  },
};
