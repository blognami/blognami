
export const styles = `
    .site {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main {
        flex-grow: 1;
        padding-top: 8rem;
        padding-bottom: 8rem;
    }

    .outer {
        padding-right: var(--gap);
        padding-left: var(--gap);
    }

    .inner {
        max-width: 1200px;
        margin: 0 auto;
    }

    @media (max-width: 767px) {
        #main {
            padding-top: 4.8rem;
            padding-bottom: 4.8rem;
        }
    }

    .wrapper {
        display: grid;
        grid-template-columns: 4fr 2fr;
        column-gap: 2.4rem;
    }

    .sidebar {
        top: 4.8rem;
        height: max-content;
        padding-left: 4rem;
        font-size: 1.4rem;
    }

    .sidebar .section + .section {
        margin-top: 8rem;
    }

    .sidebar > *:not(:first-child) {
        margin-top: 8rem;
    }


    @media (max-width: 767px) {
        .wrapper {
            grid-template-columns: 1fr;
        }

        .sidebar {
            padding-left: 0;
            margin-top: 8rem;
        }
    }

    @media (min-width: 768px) and (max-width: 991px) {
        .sidebar {
            padding-left: 1.6rem;
        }
    }
`;


export default {
    async render(){
        const { params } = this;
        const { meta = [], body } = params;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        return this.renderView('_pinstripe/_shell', {
            meta: [
                { name: 'pinstripe-load-cache-namespace', content: user ? 'signed-in' : 'signed-out' },
                ...meta
            ],
            body: this.renderHtml`
                ${this.renderView('_header')}
                <div class="${this.cssClasses.site}">
                    <main id="main" class="${this.cssClasses.main} ${this.cssClasses.outer}">
                        <div class="${this.cssClasses.inner}">
                            <div class="${this.cssClasses.wrapper}">
                                <div data-test-id="main">
                                    ${body}
                                </div>
                                <aside class="${this.cssClasses.sidebar}" data-test-id="sidebar">
                                    ${this.renderView('_sidebar')}
                                </aside>
                            </div>
                        </div>
                    </main>
                    ${this.renderView('_footer')}
                </div>
            `
        });
    }
};
