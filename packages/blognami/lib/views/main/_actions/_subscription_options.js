

export const styles = `
    .root {
        display: flex;
        gap: 16px;
        min-height: calc(100vh - 300px);
    }

    .option {
        border: 1px solid #ddd;
        flex: 1 1 0;
        padding: 16px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 1.25em;
        font-weight: bold;
    }

    .description {
        flex: 1 1 0;
    }
    
`;

export default {
    render(){
        const { options = [] } = this.params;
        
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${options.map(({ title, price, description, action }) => this.renderHtml`
                    <div class="${this.cssClasses.option}">
                        <div class="${this.cssClasses.title}">${title}</div>
                        <div class="${this.cssClasses.price}">${price}</div>
                        <div class="${this.cssClasses.description}">${description}</div>
                        <div class="${this.cssClasses.footer}">
                            ${this.renderView('_button', {
                                tagName: 'a',
                                href: action,
                                isPrimary: true,
                                isFullWidth: true,
                                body: 'Select',
                            })}
                        </div>
                    </div>
                `)}
            </div>
        `;
    }
};
