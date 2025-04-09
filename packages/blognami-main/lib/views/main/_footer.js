
export const styles = `
    .root {
        padding-top: 8rem;
        padding-bottom: 8rem;
        padding-right: var(--gap);
        padding-left: var(--gap);
        color: var(--color-secondary-text);
    }

    .inner {
        display: grid;
        grid-template-columns: 1fr 1fr;
        font-size: 1.3rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .powered-by {
        text-align: right;
    }

    .root a {
        color: var(--color-secondary-text);
    }

    .root a:hover {
        color: var(--color-black);
        opacity: 1;
    }

    @media (max-width: 767px) {
        .root {
            padding-top: 6.4rem;
            padding-bottom: 12rem;
        }

        .inner {
            grid-template-columns: 1fr;
            text-align: center;
        }

        .powered-by {
            margin-top: 3.2rem;
            text-align: center;
        }
    }
`;

export default {
    async render(){    
        const site = await this.database.site;

        return this.renderHtml`
            <footer class="${this.cssClasses.root}" data-test-id="footer">
                <div class="${this.cssClasses.inner}">
                    <div>
                        ${site.title} © ${new Date().getFullYear()}
                        | <a href="/_legal/terms-of-service">Terms of Service</a>
                        | <a href="/_legal/privacy-policy">Privacy Policy</a>
                        | <a href="/_legal/cookie-policy">Cookie Policy</a>
                    </div>    
                    <div class="${this.cssClasses.poweredBy} ">
                        <a href="https://sintra.com/" target="_blank" rel="noopener">Powered by Blognami</a>
                    </div>
                </div>
            </footer>
        `;
    }
};
