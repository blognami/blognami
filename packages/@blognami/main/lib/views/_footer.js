export const styles = ({ colors }) => `
    .root {
        border-top: 1px solid #e5e7eb;
        background-color: #f9fafb;
        padding: 4.8rem 0;
        margin-top: 6.4rem;
        color: ${colors?.semantic?.secondaryText || '#6b7280'};
    }

    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 2.4rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        font-size: 1.4rem;
        gap: 2rem;
    }

    .powered-by {
        text-align: right;
    }

    .link {
        color: ${colors?.semantic?.secondaryText || '#6b7280'};
        text-decoration: none;
    }

    .link:hover {
        color: #000;
        opacity: 1;
    }

    @media (max-width: 767px) {
        .container {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .powered-by {
            margin-top: 2rem;
            text-align: center;
        }
    }
`;

export default {
    async render(){    
        const site = await this.database.site;
        const footerSections = await this.menus.footer || [];
        
        // Get the legal section from the menu
        const legalSection = footerSections.find(section => section.label === 'Legal') || { children: [] };

        return this.renderHtml`
            <footer class="${this.cssClasses.root}" data-test-id="footer">
                <div class="${this.cssClasses.container}">
                    <div>
                        ${site.title} © ${new Date().getFullYear()}
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