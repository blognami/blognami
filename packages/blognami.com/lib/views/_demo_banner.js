export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        background: linear-gradient(135deg, ${colors.gray[900]} 0%, ${colors.gray[800]} 100%);
        color: ${colors.gray[100]};
        position: relative;
        overflow: hidden;
    }

    .root::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 50%, color-mix(in oklch, ${colors.lime[500]} 8%, transparent) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, color-mix(in oklch, ${colors.lime[500]} 5%, transparent) 0%, transparent 40%);
        pointer-events: none;
    }

    .container {
        position: relative;
        max-width: ${remify(1280)};
        margin: 0 auto;
        padding: ${remify(16)} ${remify(16)};
        display: flex;
        flex-direction: column;
        gap: ${remify(12)};
        align-items: flex-start;
    }

    .message {
        font-size: ${remify(14)};
        line-height: 1.5;
    }

    .countdown {
        font-weight: 600;
        color: ${colors.lime[400]};
        font-variant-numeric: tabular-nums;
    }

    .cta {
        display: flex;
        gap: ${remify(8)};
        flex-wrap: wrap;
    }

    .cta a {
        width: 100%;
    }

    ${breakpointFor('md')} {
        .container {
            flex-direction: row;
            align-items: center;
            padding: ${remify(16)} ${remify(24)};
            gap: ${remify(24)};
        }

        .message {
            flex: 1;
        }

        .cta a {
            width: auto;
        }
    }
`;

export const decorators = {
    countdown(){
        if(this.node.expiryDate == undefined){
            const initialExpirySeconds = parseInt(this.params.expirySeconds);
            this.node.expiryDate = new Date(Date.now() + initialExpirySeconds * 1000);
        }

        const updateCountdown = () => {
            const expirySeconds = Math.max(0, Math.floor((this.node.expiryDate - Date.now()) / 1000));

            const days = Math.floor(expirySeconds / (24 * 3600));
            const hours = Math.floor((expirySeconds % (24 * 3600)) / 3600);
            const minutes = Math.floor((expirySeconds % 3600) / 60);
            const seconds = expirySeconds % 60;

            let formatted = '';
            if (days > 0) formatted += `${days} ${days == 1 ? 'day' : 'days'}, `;
            if (hours > 0 || days > 0) formatted += `${hours} ${hours == 1 ? 'hour' : 'hours'}, `;
            if (minutes > 0 || hours > 0 || days > 0) formatted += `${minutes} ${minutes == 1 ? 'minute' : 'minutes'} and `;
            formatted += `${seconds} ${seconds == 1 ? 'second' : 'seconds'}`;

            this.patch(formatted.trim());
        };

        updateCountdown();

        this.setInterval(updateCountdown, 1000);
    }
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default {
    async render(){
        const { expirySeconds, tenantId, tenantName } = this.params;
        const showClaimButton = UUID_REGEX.test(tenantName);

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <div class="${this.cssClasses.container}">
                    <div class="${this.cssClasses.message}">This demo will be automatically deleted in <span class="${this.cssClasses.countdown}" data-expiry-seconds="${expirySeconds}"></span>.</div>
                    <div class="${this.cssClasses.cta}">
                        ${this.renderView('_button', {
                            tagName: 'a',
                            body: 'Sign up to keep your data',
                            href: `/_actions/admin/saas_subscribe?tenantId=${tenantId}`,
                            target: '_overlay',
                            ['data-test-id']: 'demo-banner-subscribe-button',
                        })}
                        ${() => {
                            if(showClaimButton) return this.renderView('_button', {
                                tagName: 'a',
                                body: 'Claim your site',
                                href: '/_actions/admin/claim_site',
                                target: '_overlay',
                                ['data-test-id']: 'demo-banner-claim-button',
                            });
                        }}
                    </div>
                </div>
            </div>
        `;
    }
};
