
export const styles = ({ breakpointFor }) => `
    .root {
        background-color: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 40;
        backdrop-filter: blur(8px);
        background-color: rgba(255, 255, 255, 0.95);
    }

    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 6.4rem;
    }

    .link-group {
        display: flex;
        align-items: center;
        gap: 3.2rem;
    }

    .link-group-items {
        display: none;
        align-items: center;
        gap: 2.4rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    ${breakpointFor('md')} {
        .container {
            padding: 0 2.4rem;
        }

        .link-group-items {
            display: flex;
        }
    }
`;

export default {
    async render(){
        const items = await this.menus.navbar || [];

        return this.renderHtml`
            <header class="${this.cssClasses.root}" id="pinstripe-scroll-top" data-test-id="navbar">
                <div class="${this.cssClasses.container}">
                    ${this.renderView('_navbar/_branding')}
                    <nav class="${this.cssClasses.linkGroup}">
                        <ul class="${this.cssClasses.linkGroupItems}">
                            ${items.map(({ partial, ...item }) => {
                                return this.renderHtml`
                                    <li>${this.renderView(partial, item)}</li>
                                `;
                            })}
                        </ul>
                        ${this.renderView('_navbar/_burger_link')}
                    </nav>
                </div>
            </header>
        `;
    }
};