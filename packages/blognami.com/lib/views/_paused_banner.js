export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        background: linear-gradient(135deg, ${colors.red[900]} 0%, ${colors.red[800]} 100%);
        color: ${colors.red[100]};
        position: relative;
        overflow: hidden;
    }

    .root::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 20% 50%, color-mix(in oklch, ${colors.red[500]} 8%, transparent) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, color-mix(in oklch, ${colors.red[500]} 5%, transparent) 0%, transparent 40%);
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

export default {
    async render(){
        const { tenantId } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <div class="${this.cssClasses.container}">
                    <div class="${this.cssClasses.message}">Your demo has expired. This site is paused and in read-only mode. Choose a plan to reactivate your site and keep your content.</div>
                    <div class="${this.cssClasses.cta}">
                        ${this.renderView('_button', {
                            tagName: 'a',
                            body: 'Choose a plan to reactivate',
                            href: `/_actions/admin/saas_subscribe?tenantId=${tenantId}`,
                            target: '_overlay',
                            ['data-test-id']: 'paused-banner-subscribe-button',
                        })}
                    </div>
                </div>
            </div>
        `;
    }
};
