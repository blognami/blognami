
export const styles = ({ packages }) => `
    .root {
        padding-top: 8rem;
        padding-bottom: 8rem;
        padding-right: 3.6rem;
        padding-left: 3.6rem;
        color: ${packages.pinstripe.colors.secondaryText};
    }
    
    @media (max-width: 767px) {
        .root {
            padding-right: 2rem;
            padding-left: 2rem;
        }
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
        color: ${packages.pinstripe.colors.secondaryText};
    }

    .root a:hover {
        color: #000;
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
                        | <a href="/legal/terms-of-service">Terms of Service</a>
                        | <a href="/legal/privacy-policy">Privacy Policy</a>
                        | <a href="/legal/cookie-policy">Cookie Policy</a>
                    </div>    
                    <div class="${this.cssClasses.poweredBy} ">
                        <a href="https://blognami.com/" target="_blank" rel="noopener">Powered by Blognami</a>
                    </div>
                </div>
            </footer>
        `;
    }
};
