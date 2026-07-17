export const decorators = {
    button(){
        this.attributes.href = `${this.attributes.href}&returnUrl=${encodeURIComponent(window.location.href)}`;
    }
};

export const styles = ({ colors, remify, breakpointFor, shadow }) => `
    .root {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${remify(20)};
        margin: ${remify(40)} 0;
        padding: ${remify(32)} ${remify(20)};
        text-align: center;
        background-color: ${colors.gray[50]};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-top: ${remify(3)} solid ${colors.semantic.accent};
        border-radius: ${remify(12)};
        box-shadow: ${shadow.sm};
    }

    .message {
        margin: 0;
        max-width: ${remify(480)};
        font-size: ${remify(18)};
        font-weight: 600;
        line-height: 1.4;
        color: ${colors.semantic.primaryText};
    }

    ${breakpointFor('md')} {
        .root {
            padding: ${remify(48)} ${remify(32)};
        }

        .message {
            font-size: ${remify(20)};
        }
    }
`;

export default {
    async render(){
        const { access, noun = 'post', withheld = false } = this.params;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const state = await this.database.newsletter.ctaState(user);
        if(!withheld && state == 'none') return;

        let message;
        if(withheld && state == 'none'){
            message = access == 'paid' ? `This ${noun} is for paid members.` : `This ${noun} is for members.`;
        } else if(withheld && access == 'paid'){
            message = `This ${noun} is for paid members. Upgrade to keep reading.`;
        } else if(withheld){
            message = `This ${noun} is for members. Sign up free to keep reading.`;
        } else if(state == 'upgrade'){
            message = `You're on the free plan — upgrade for full access to everything.`;
        } else {
            message = `Enjoy this ${noun}? Subscribe to get new posts straight to your inbox.`;
        }

        const href = `/_actions/user/subscribe?subscribableId=${await this.database.newsletter.id}`;

        return this.renderHtml`
            <aside class="${this.cssClasses.root}">
                <p class="${this.cssClasses.message}">${message}</p>
                ${() => {
                    if(state == 'none') return;

                    return this.renderView(`_button`, {
                        tagName: 'a',
                        target: '_overlay',
                        isPrimary: true,
                        size: 'large',
                        href,
                        class: this.cssClasses.button,
                        body: state == 'upgrade' ? 'Upgrade now' : 'Subscribe now',
                        ['data-test-id']: 'subscribe-now-button',
                    });
                }}
            </aside>
        `;
    }
};
