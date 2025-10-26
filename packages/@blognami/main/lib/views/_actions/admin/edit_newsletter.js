export default {

  async render() {export default {

    const that = this;  async render() {

    const that = this;

    const newsletter = await this.database.newsletter;

    const newsletter = await this.database.newsletter;

    const enableMonthly = this.params._method == 'GET' ? newsletter.enableMonthly : this.params.enableMonthly == 'true';

    const enableYearly = this.params._method == 'GET' ? newsletter.enableYearly : this.params.enableYearly == 'true';    const enableMonthly = this.params._method == 'GET' ? newsletter.enableMonthly : this.params.enableMonthly == 'true';

    const enableYearly = this.params._method == 'GET' ? newsletter.enableYearly : this.params.enableYearly == 'true';

    const fields = [];

    const fields = [];

    fields.push({ name: 'enableMonthly', watch: true });

    if (enableMonthly) {    fields.push({ name: 'enableMonthly', watch: true });

      fields.push('monthlyPrice');    if (enableMonthly) {

    }      fields.push('monthlyPrice');

    }

    fields.push({ name: 'enableYearly', watch: true });

    if (enableYearly) {    fields.push({ name: 'enableYearly', watch: true });

      fields.push('yearlyPrice');    if (enableYearly) {

    }      fields.push('yearlyPrice');

    }

    if (enableMonthly || enableYearly) {

      const options = this.currency.list.reduce(    if (enableMonthly || enableYearly) {

        (out, { name, isoCode } ) => ({ ...out, [isoCode]: `${isoCode} - ${name}` }),      const options = this.currency.list.reduce(

        {}        (out, { name, isoCode } ) => ({ ...out, [isoCode]: `${isoCode} - ${name}` }),

      );        {}

      fields.push({ name: 'currency', type: 'select', options });      );

    }      fields.push({ name: 'currency', type: 'select', options });

    }

    fields.push('enableFree');

    fields.push('enableFree');

    return this.renderForm(newsletter, {

      fields,    return this.renderForm(newsletter, {

      fields,

      async validateWith(){

        const isPaid = this.enableMonthly || this.enableYearly;      async validateWith(){

        if(!this.isValidationError('general') && isPaid && !await that.database.stripe.isConfiguredCorrectly()){        const isPaid = this.enableMonthly || this.enableYearly;

          this.setValidationError('general', that.renderHtml`Stripe must be configured to offer paid memberships - ${that.renderView('_button', {        if(!this.isValidationError('general') && isPaid && !await that.database.stripe.isConfiguredCorrectly()){

            tagName: 'a',          this.setValidationError('general', that.renderHtml`Stripe must be configured to offer paid memberships - ${that.renderView('_button', {

            target: '_overlay',            tagName: 'a',

            href: '/_actions/admin/edit_stripe',            target: '_overlay',

            size: 'small',            href: '/_actions/admin/edit_stripe',

            isPrimary: true,            size: 'small',

            body: 'Configure stripe now',            isPrimary: true,

          })}.`);            body: 'Configure stripe now',

        }          })}.`);

      },        }

    });      },

  },    });

};  },
};
