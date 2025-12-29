export const styles = ({ colors, remify }) => `
    .root {
        display: flex;
        gap: ${remify(16)};
        min-height: calc(100vh - ${remify(300)});
    }

    .option {
        border: ${remify(1)} solid ${colors.gray[300]};
        flex: 1 1 0;
        padding: ${remify(16)};
        border-radius: ${remify(12)};
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 1.25em;
        font-weight: bold;
    }

    .price {
        margin-bottom: ${remify(16)};
        font-size: 0.8em;
    }

    .features {
        flex: 1 1 0;
    }

    .features ul {
        margin: 0;
        padding: 0 0 0 1em;
        display: flex;
        flex-direction: column;
        gap: 0.2em;
    }

    .features li {
        font-size: 0.8em;
    }

`;

export default {
    render(){
        const { options = [] } = this.params;
        
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${options.map(({ title, price, features, action }) => this.renderHtml`
                    <div class="${this.cssClasses.option}">
                        <div class="${this.cssClasses.title}">${title}</div>
                        <div class="${this.cssClasses.price}">${price}</div>
                        <div class="${this.cssClasses.features}">
                            <ul>
                                ${features.map(feature => this.renderHtml`
                                    <li>${feature}</li>
                                `)}
                            </ul>
                        </div>
                        <div class="${this.cssClasses.footer}">
                            ${this.renderView('_button', {
                                tagName: 'a',
                                href: action,
                                isPrimary: true,
                                isFullWidth: true,
                                body: 'Select',
                                ['data-test-id']: `${title.toLowerCase().replace(/\s+/g, '-')}-subscription-button`,
                            })}
                        </div>
                    </div>
                `)}
            </div>
        `;
    }
};