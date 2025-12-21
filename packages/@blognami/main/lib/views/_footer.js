
export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        border-top: ${remify(1)} solid ${colors.gray[200]};
        background-color: ${colors.gray[50]};
        padding: ${remify(48)} 0;
        margin-top: ${remify(64)};
        color: ${colors.semantic.secondaryText};
    }

    .container {
        max-width: ${remify(1280)};
        margin: 0 auto;
        padding: 0 ${remify(24)};
        display: grid;
        grid-template-columns: 1fr;
        text-align: center;
        font-size: ${remify(14)};
        gap: ${remify(20)};
    }

    .powered-by {
        margin-top: ${remify(20)};
        text-align: center;
    }

    .link {
        color: ${colors.semantic.secondaryText};
        text-decoration: none;
    }

    .link:hover {
        color: ${colors.gray[950]};
        opacity: 1;
    }

    ${breakpointFor('md')} {
        .container {
            grid-template-columns: 1fr 1fr;
            text-align: left;
        }

        .powered-by {
            margin-top: 0;
            text-align: right;
        }
    }
`;

export default {
    async render(){
        this.copyrightOwner = await this.database.site.copyrightOwner || await this.database.site.title;

        await this.runHook('beforeRender');

        const legalItems = await this.menus.legal || [];

        return this.renderHtml`
            <footer class="${this.cssClasses.root}" data-test-id="footer">
                <div class="${this.cssClasses.container}">
                    <div>
                        ${this.copyrightOwner} © ${new Date().getFullYear()}
                        ${legalItems.map(item => {
                            return this.renderHtml` | <a class="${this.cssClasses.link}" href="${item.url}">${item.label}</a>`;
                        })}
                    </div>
                    <div class="${this.cssClasses.poweredBy}">
                        <a class="${this.cssClasses.link}" href="https://blognami.com/" target="_blank" rel="noopener">Powered by Blognami</a>
                    </div>
                </div>
            </footer>
        `;
    }
};
