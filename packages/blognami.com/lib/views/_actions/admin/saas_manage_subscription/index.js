export const styles = ({ colors, breakpointFor, remify, shadow }) => `
    .container {
        padding: ${remify(32)};
        max-width: ${remify(1000)};
        margin: 0 auto;
        background: ${colors.white};
        border-radius: ${remify(12)};
    }

    .title {
        font-size: ${remify(28)};
        font-weight: 700;
        color: ${colors.gray[900]};
        text-align: center;
        margin-bottom: ${remify(8)};
    }

    .subtitle {
        font-size: ${remify(16)};
        color: ${colors.gray[600]};
        text-align: center;
        margin-bottom: ${remify(32)};
    }

    .current-plan {
        background: ${colors.gray[50]};
        border: ${remify(2)} solid ${colors.gray[200]};
        border-radius: ${remify(12)};
        padding: ${remify(24)};
        margin-bottom: ${remify(32)};
    }

    .current-plan-title {
        font-size: ${remify(18)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin-bottom: ${remify(16)};
    }

    .current-plan-details {
        display: flex;
        flex-direction: column;
        gap: ${remify(8)};
        font-size: ${remify(14)};
        color: ${colors.gray[700]};
    }

    .current-plan-detail {
        display: flex;
        align-items: center;
        gap: ${remify(8)};
    }

    .current-plan-label {
        font-weight: 500;
        color: ${colors.gray[600]};
    }

    .billing-toggle {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: ${remify(16)};
        margin-bottom: ${remify(40)};
    }

    .billing-toggle label {
        font-size: ${remify(14)};
        color: ${colors.gray[700]};
        font-weight: 500;
        cursor: pointer;
        user-select: none;
    }

    .billing-toggle input[type="radio"] {
        margin: 0 ${remify(4)} 0 0;
        cursor: pointer;
    }

    .savings-badge {
        display: inline-block;
        background: ${colors.lime[100]};
        color: ${colors.lime[800]};
        padding: ${remify(4)} ${remify(8)};
        border-radius: ${remify(4)};
        font-size: ${remify(12)};
        font-weight: 600;
        margin-left: ${remify(8)};
    }

    .plans-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: ${remify(24)};
        margin-bottom: ${remify(32)};
    }

    ${breakpointFor('md')} {
        .plans-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    .plan-card {
        background: ${colors.white};
        border: ${remify(2)} solid ${colors.gray[200]};
        border-radius: ${remify(12)};
        padding: ${remify(32)};
        box-shadow: ${shadow.sm};
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
    }

    .plan-card:hover {
        border-color: ${colors.lime[400]};
        box-shadow: ${shadow.lg};
        transform: translateY(-${remify(4)});
    }

    .plan-card[data-current="true"] {
        border-color: ${colors.lime[500]};
        background: ${colors.lime[50]};
    }

    .current-badge {
        display: inline-block;
        background: ${colors.lime[500]};
        color: ${colors.white};
        padding: ${remify(4)} ${remify(12)};
        border-radius: ${remify(4)};
        font-size: ${remify(12)};
        font-weight: 600;
        margin-left: ${remify(8)};
    }

    .plan-name {
        font-size: ${remify(24)};
        font-weight: 700;
        color: ${colors.gray[900]};
        margin-bottom: ${remify(16)};
    }

    .plan-price {
        margin-bottom: ${remify(24)};
    }

    .price-amount {
        font-size: ${remify(48)};
        font-weight: 700;
        color: ${colors.gray[900]};
        line-height: 1;
    }

    .price-interval {
        font-size: ${remify(16)};
        color: ${colors.gray[600]};
        font-weight: 400;
    }

    .annual-note {
        font-size: ${remify(14)};
        color: ${colors.gray[500]};
        margin-top: ${remify(8)};
    }

    .features {
        list-style: none;
        padding: 0;
        margin: 0 0 ${remify(32)} 0;
        flex-grow: 1;
    }

    .feature {
        display: flex;
        align-items: flex-start;
        gap: ${remify(12)};
        padding: ${remify(12)} 0;
        font-size: ${remify(14)};
        color: ${colors.gray[700]};
    }

    .feature::before {
        content: "✓";
        color: ${colors.lime[600]};
        font-weight: 700;
        font-size: ${remify(18)};
        flex-shrink: 0;
    }

    .select-button {
        margin-top: auto;
    }

    .cancel-section {
        text-align: center;
        padding: ${remify(24)} 0;
        border-top: ${remify(1)} solid ${colors.gray[200]};
    }

    .cancel-text {
        font-size: ${remify(14)};
        color: ${colors.gray[600]};
        margin-bottom: ${remify(16)};
    }

    .cancel-link {
        color: ${colors.red[600]};
        text-decoration: underline;
        cursor: pointer;
    }

    .cancel-link:hover {
        color: ${colors.red[700]};
    }
`;

export const decorators = {
    billingToggle(){
        this.findAll('input[type="radio"]').forEach(radio => {
            radio.on('change', () => {
                const interval = radio.value;
                const root = this.parent;

                root.findAll('[data-monthly]').forEach(el => {
                    el.node.style.display = interval === 'monthly' ? 'block' : 'none';
                });
                root.findAll('[data-yearly]').forEach(el => {
                    el.node.style.display = interval === 'yearly' ? 'block' : 'none';
                });

                root.findAll('[data-interval-field]').forEach(link => {
                    const currentHref = link.node.href;
                    const url = new URL(currentHref);
                    url.searchParams.set('interval', interval);
                    link.node.href = url.toString();
                });
            });
        });
    }
};

export default {
    async render(){
        if(await this.isSignedOut){
            return this.renderRedirect({
                url: `/_actions/guest/sign_in?returnUrl=${encodeURIComponent('/_actions/admin/saas_manage_subscription')}`
            });
        }

        const tenant = await this.database.tenant;

        if(!tenant){
            return this.renderRedirect({ target: '_top' });
        }

        // Show subscription management UI
        const config = tenant.subscriptionConfig;
        const starterPlan = config.plans.starter;
        const publisherPlan = config.plans.publisher;

        const currentPlan = tenant.subscriptionPlan || 'none';
        const currentInterval = tenant.subscriptionInterval || 'monthly';

        const currentPlanConfig = currentPlan === 'starter' ? starterPlan :
                                  currentPlan === 'publisher' ? publisherPlan : null;

        return this.renderHtml`
            <pinstripe-modal>
                <div class="${this.cssClasses.container}">
                    <h1 class="${this.cssClasses.title}">Manage Subscription</h1>
                    <p class="${this.cssClasses.subtitle}">Update your plan</p>

                    ${currentPlanConfig ? this.renderHtml`
                        <div class="${this.cssClasses.currentPlan}">
                            <div class="${this.cssClasses.currentPlanTitle}">Current Subscription</div>
                            <div class="${this.cssClasses.currentPlanDetails}">
                                <div class="${this.cssClasses.currentPlanDetail}">
                                    <span class="${this.cssClasses.currentPlanLabel}">Plan:</span>
                                    <span>${currentPlanConfig.name}</span>
                                </div>
                                <div class="${this.cssClasses.currentPlanDetail}">
                                    <span class="${this.cssClasses.currentPlanLabel}">Billing:</span>
                                    <span>${currentInterval === 'monthly' ? 'Monthly' : 'Annual'}</span>
                                </div>
                                <div class="${this.cssClasses.currentPlanDetail}">
                                    <span class="${this.cssClasses.currentPlanLabel}">Price:</span>
                                    <span>$${currentInterval === 'monthly' ? currentPlanConfig.monthlyPrice : Math.round(currentPlanConfig.yearlyPrice / 12)}/month${currentInterval === 'yearly' ? ' (billed annually at $' + currentPlanConfig.yearlyPrice + ')' : ''}</span>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="${this.cssClasses.billingToggle}">
                        <label>
                            <input type="radio" name="billing" value="monthly" ${currentInterval === 'monthly' ? 'checked' : ''}>
                            Monthly
                        </label>
                        <label>
                            <input type="radio" name="billing" value="yearly" ${currentInterval === 'yearly' ? 'checked' : ''}>
                            Annual
                            <span class="${this.cssClasses.savingsBadge}">Save 20%</span>
                        </label>
                    </div>

                    <div class="${this.cssClasses.plansGrid}">
                        <div class="${this.cssClasses.planCard}" data-current="${currentPlan === 'starter'}">
                            <div class="${this.cssClasses.planName}">
                                ${starterPlan.name}
                                ${currentPlan === 'starter' ? this.renderHtml`
                                    <span class="${this.cssClasses.currentBadge}">Current</span>
                                ` : ''}
                            </div>
                            <div class="${this.cssClasses.planPrice}">
                                <div data-monthly style="${currentInterval === 'yearly' ? 'display: none;' : ''}">
                                    <span class="${this.cssClasses.priceAmount}">$${starterPlan.monthlyPrice}</span>
                                    <span class="${this.cssClasses.priceInterval}">/month</span>
                                </div>
                                <div data-yearly style="${currentInterval === 'monthly' ? 'display: none;' : ''}">
                                    <span class="${this.cssClasses.priceAmount}">$${Math.round(starterPlan.yearlyPrice / 12)}</span>
                                    <span class="${this.cssClasses.priceInterval}">/month</span>
                                    <div class="${this.cssClasses.annualNote}">Billed annually at $${starterPlan.yearlyPrice}</div>
                                </div>
                            </div>
                            <ul class="${this.cssClasses.features}">
                                ${starterPlan.features.map(feature => this.renderHtml`
                                    <li class="${this.cssClasses.feature}">${feature}</li>
                                `)}
                            </ul>
                            <div class="${this.cssClasses.selectButton}">
                                ${currentPlan === 'starter' ? this.renderView('_button', {
                                    tagName: 'button',
                                    type: 'button',
                                    body: 'Current Plan',
                                    isPrimary: false,
                                    isFullWidth: true,
                                    size: 'large',
                                    disabled: true
                                }) : this.renderView('_button', {
                                    tagName: 'a',
                                    href: `/_actions/admin/saas_manage_subscription/update_plan?plan=starter&interval=${currentInterval}`,
                                    target: '_overlay',
                                    'data-method': 'post',
                                    'data-placeholder': '/_placeholders/overlay',
                                    'data-interval-field': '',
                                    body: 'Select Starter',
                                    isPrimary: true,
                                    isFullWidth: true,
                                    size: 'large'
                                })}
                            </div>
                        </div>

                        <div class="${this.cssClasses.planCard}" data-current="${currentPlan === 'publisher'}">
                            <div class="${this.cssClasses.planName}">
                                ${publisherPlan.name}
                                ${currentPlan === 'publisher' ? this.renderHtml`
                                    <span class="${this.cssClasses.currentBadge}">Current</span>
                                ` : ''}
                            </div>
                            <div class="${this.cssClasses.planPrice}">
                                <div data-monthly style="${currentInterval === 'yearly' ? 'display: none;' : ''}">
                                    <span class="${this.cssClasses.priceAmount}">$${publisherPlan.monthlyPrice}</span>
                                    <span class="${this.cssClasses.priceInterval}">/month</span>
                                </div>
                                <div data-yearly style="${currentInterval === 'monthly' ? 'display: none;' : ''}">
                                    <span class="${this.cssClasses.priceAmount}">$${Math.round(publisherPlan.yearlyPrice / 12)}</span>
                                    <span class="${this.cssClasses.priceInterval}">/month</span>
                                    <div class="${this.cssClasses.annualNote}">Billed annually at $${publisherPlan.yearlyPrice}</div>
                                </div>
                            </div>
                            <ul class="${this.cssClasses.features}">
                                ${publisherPlan.features.map(feature => this.renderHtml`
                                    <li class="${this.cssClasses.feature}">${feature}</li>
                                `)}
                            </ul>
                            <div class="${this.cssClasses.selectButton}">
                                ${currentPlan === 'publisher' ? this.renderView('_button', {
                                    tagName: 'button',
                                    type: 'button',
                                    body: 'Current Plan',
                                    isPrimary: false,
                                    isFullWidth: true,
                                    size: 'large',
                                    disabled: true
                                }) : this.renderView('_button', {
                                    tagName: 'a',
                                    href: `/_actions/admin/saas_manage_subscription/update_plan?plan=publisher&interval=${currentInterval}`,
                                    target: '_overlay',
                                    'data-method': 'post',
                                    'data-placeholder': '/_placeholders/overlay',
                                    'data-interval-field': '',
                                    body: 'Select Publisher',
                                    isPrimary: true,
                                    isFullWidth: true,
                                    size: 'large'
                                })}
                            </div>
                        </div>
                    </div>

                    <div class="${this.cssClasses.cancelSection}">
                        <p class="${this.cssClasses.cancelText}">Need to cancel your subscription?</p>
                        <a href="/_actions/admin/saas_unsubscribe" class="${this.cssClasses.cancelLink}" data-test-id="saas-unsubscribe" data-confirm="Are you sure you want to cancel your subscription?" data-placeholder="/_placeholders/overlay">Cancel Subscription</a>
                    </div>

                </div>
            </pinstripe-modal>
        `;
    }
};
