
export const styles = ({ colors, breakpointFor }) => `
    .root {
        border-top: 1px solid ${colors.gray[200]};
        background-color: ${colors.gray[50]};
        padding: 4.8rem 0;
        margin-top: 6.4rem;
        color: ${colors.semantic.secondaryText};
    }

    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 2.4rem;
        display: grid;
        grid-template-columns: 1fr;
        text-align: center;
        font-size: 1.4rem;
        gap: 2rem;
    }

    .powered-by {
        margin-top: 2rem;
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

        const footerSections = await this.menus.footer || [];
        const legalSection = footerSections.find(section => section.label === 'Legal') || { children: [] };

        return this.renderHtml`
            <footer class="${this.cssClasses.root}" data-test-id="footer">
                <div class="${this.cssClasses.container}">
                    <div>
                        ${this.copyrightOwner} © ${new Date().getFullYear()}
                        ${legalSection.children.map(child => {
                            return this.renderHtml` | <a class="${this.cssClasses.link}" href="${child.url}">${child.label}</a>`;
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
