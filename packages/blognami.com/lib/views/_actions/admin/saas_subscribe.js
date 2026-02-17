export const styles = ({ colors, breakpointFor, remify, shadow }) => `
    .plans-container {
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

                root.findAll('[data-plan-link]').forEach(card => {
                    const url = new URL(card.node.href);
                    url.searchParams.set('interval', interval);
                    card.patch({ ...card.attributes, href: url.pathname + url.search });
                });
            });
        });
    }
};

export default {
    async render(){
        const { tenantId, plan, interval } = this.params;

        if(await this.isSignedOut){
            return this.renderRedirect({
                url: `/_actions/guest/sign_in?returnUrl=${encodeURIComponent(`/_actions/admin/saas_subscribe?tenantId=${tenantId}`)}`
            });
        }

        const user = await this.session.user;
        const tenant = await this.database.withoutTenantScope.tenants
            .where({ id: tenantId }).first();

        if(!tenant){
            return this.renderHtml`
                <pinstripe-modal>
                    ${this.renderView('_panel', {
                        title: 'Error',
                        body: this.renderHtml`<p>Blog not found.</p>`,
                        footer: this.renderView('_button', {
                            body: this.renderHtml`
                                OK
                                <script type="pinstripe">
                                    this.parent.on('click', () => this.trigger('close'));
                                </script>
                            `
                        })
                    })}
                </pinstripe-modal>
            `;
        }

        // If plan and interval are provided, proceed to checkout
        if(plan && interval){
            const returnUrl = new URL('/', this.params._url);
            returnUrl.host = tenant.host;

            const userEmail = user.email;
            const userName = user.name;

            // Create the holding page URL that will be returned to after Stripe checkout
            const holdingPageUrl = new URL('/_actions/admin/saas_subscription_holding_page', this.params._url);
            holdingPageUrl.searchParams.set('tenantId', tenantId);
            holdingPageUrl.searchParams.set('plan', plan);
            holdingPageUrl.searchParams.set('interval', interval);
            holdingPageUrl.searchParams.set('returnUrl', returnUrl.toString());

            const paymentUrl = await this.runInNewPortalWorkspace(async function(){
                let portalUser = await this.database.users.where({ email: userEmail }).first();
                if(!portalUser){
                    portalUser = await this.database.users.insert({
                        name: userName,
                        email: userEmail,
                        role: 'user'
                    });
                }
                const portalTenant = await this.database.tenants.where({ id: tenantId }).first();
                return portalTenant.createSubscribeUrl(portalUser, {
                    plan,
                    interval,
                    returnUrl: holdingPageUrl.toString()
                });
            });

            if(!paymentUrl){
                return this.renderHtml`
                    <pinstripe-modal>
                        ${this.renderView('_panel', {
                            title: 'Error',
                            body: this.renderHtml`<p>Payment is not configured. Please contact support.</p>`,
                            footer: this.renderView('_button', {
                                body: this.renderHtml`
                                    OK
                                    <script type="pinstripe">
                                        this.parent.on('click', () => this.trigger('close'));
                                    </script>
                                `
                            })
                        })}
                    </pinstripe-modal>
                `;
            }

            return this.renderHtml`
                <script type="pinstripe">
                    window.location.href = ${this.renderHtml(JSON.stringify(paymentUrl))};
                </script>
            `;
        }

        // Show plan selection UI
        const config = tenant.subscriptionConfig;
        const starterPlan = config.plans.starter;
        const publisherPlan = config.plans.publisher;

        return this.renderHtml`
            <pinstripe-modal>
                <div class="${this.cssClasses.plansContainer}">
                    <h1 class="${this.cssClasses.title}">Choose Your Plan</h1>
                    <p class="${this.cssClasses.subtitle}">Select the plan that best fits your needs</p>

                    <div class="${this.cssClasses.billingToggle}">
                        <label>
                            <input type="radio" name="billing" value="monthly" checked>
                            Monthly
                        </label>
                        <label>
                            <input type="radio" name="billing" value="yearly">
                            Annual
                            <span class="${this.cssClasses.savingsBadge}">Save 20%</span>
                        </label>
                    </div>

                    <div class="${this.cssClasses.plansGrid}">
                        <div class="${this.cssClasses.planCard}">
                            <div class="${this.cssClasses.planName}">${starterPlan.name}</div>
                            <div class="${this.cssClasses.planPrice}">
                                <div data-monthly>
                                    <span class="${this.cssClasses.priceAmount}">$${starterPlan.monthlyPrice}</span>
                                    <span class="${this.cssClasses.priceInterval}">/month</span>
                                </div>
                                <div data-yearly style="display: none;">
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
                                ${this.renderView('_button', {
                                    tagName: 'a',
                                    body: 'Select Starter',
                                    isPrimary: true,
                                    isFullWidth: true,
                                    size: 'large',
                                    href: `/_actions/admin/saas_subscribe?tenantId=${tenantId}&plan=starter&interval=monthly`,
                                    ['data-plan-link']: 'starter'
                                })}
                            </div>
                        </div>

                        <div class="${this.cssClasses.planCard}">
                            <div class="${this.cssClasses.planName}">${publisherPlan.name}</div>
                            <div class="${this.cssClasses.planPrice}">
                                <div data-monthly>
                                    <span class="${this.cssClasses.priceAmount}">$${publisherPlan.monthlyPrice}</span>
                                    <span class="${this.cssClasses.priceInterval}">/month</span>
                                </div>
                                <div data-yearly style="display: none;">
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
                                ${this.renderView('_button', {
                                    tagName: 'a',
                                    body: 'Select Publisher',
                                    isPrimary: true,
                                    isFullWidth: true,
                                    size: 'large',
                                    href: `/_actions/admin/saas_subscribe?tenantId=${tenantId}&plan=publisher&interval=monthly`,
                                    ['data-plan-link']: 'publisher'
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </pinstripe-modal>
        `;
    }
};
