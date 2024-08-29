
export const decorators = {
  root(){
    const enableMonthlyPaidSubscriptions = this.find('input[name="enableMonthlyPaidSubscriptions"]');
    const monthlyPaidSubscriptionPrice = this.find('input[name="monthlyPaidSubscriptionPrice"]');
    const enableYearlyPaidSubscriptions = this.find('input[name="enableYearlyPaidSubscriptions"]');
    const yearlyPaidSubscriptionPrice = this.find('input[name="yearlyPaidSubscriptionPrice"]');
    const subscriptionFreeTrialDays = this.find('input[name="subscriptionFreeTrialDays"]');

    const updateVisibility = () => {
      monthlyPaidSubscriptionPrice.parent.patch({ style: enableMonthlyPaidSubscriptions.value ? '' : 'display: none;'});
      yearlyPaidSubscriptionPrice.parent.patch({ style: enableYearlyPaidSubscriptions.value ? '' : 'display: none;'});
      subscriptionFreeTrialDays.parent.patch({ style: enableMonthlyPaidSubscriptions.value || enableYearlyPaidSubscriptions.value ? '' : 'display: none;'});
    };

    enableMonthlyPaidSubscriptions.on('change', updateVisibility);
    enableYearlyPaidSubscriptions.on('change', updateVisibility);

    updateVisibility();
  }
};

export default {
  async render() {
    const site = await this.database.site;

    return this.renderForm(site, {
      class: this.cssClasses.root,

      fields: [
        "enableMonthlyPaidSubscriptions",
        "monthlyPaidSubscriptionPrice",
        "enableYearlyPaidSubscriptions",
        "yearlyPaidSubscriptionPrice",
        "subscriptionFreeTrialDays",
        "enableFreeSubscriptions",
      ],
    });
  },
};
