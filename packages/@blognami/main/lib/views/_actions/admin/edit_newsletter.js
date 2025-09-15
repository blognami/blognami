
export default {
  async render() {
    const that = this;

    const newsletter = await this.database.newsletter;

    const enableMonthly = this.params._method == 'GET' ? newsletter.enableMonthly : this.params.enableMonthly == 'true';
    const enableYearly = this.params._method == 'GET' ? newsletter.enableYearly : this.params.enableYearly == 'true';

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

    return this.renderForm(newsletter, {
      fields,

      async validateWith(){
        const isPaid = this.enableMonthly || this.enableYearly;
        if(!this.isValidationError('general') && isPaid && !await that.database.stripe.isConfiguredCorrectly()){
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
    });
  },
};
