
export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        background-color: ${colors.white};
        border-bottom: ${remify(1)} solid ${colors.gray[200]};
        position: sticky;
        top: 0;
        z-index: 40;
        backdrop-filter: blur(${remify(8)});
        background-color: color-mix(in oklch, ${colors.white} 95%, transparent);
    }

    .container {
        max-width: ${remify(1280)};
        margin: 0 auto;
        padding: 0 ${remify(16)};
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: ${remify(64)};
    }

    .link-group {
        display: flex;
        align-items: center;
        gap: ${remify(32)};
    }

    .link-group-items {
        display: none;
        align-items: center;
        gap: ${remify(24)};
        list-style: none;
        margin: 0;
        padding: 0;
    }

    ${breakpointFor('md')} {
        .container {
            padding: 0 ${remify(24)};
        }

        .link-group-items {
            display: flex;
        }
    }
`;

export default {
    async render(){
        const items = await this.menus.user || [];

        return this.renderHtml`
            <header class="${this.cssClasses.root}" id="pinstripe-scroll-top" data-test-id="navbar">
                <div class="${this.cssClasses.container}">
                    ${this.renderView('_navbar/_branding')}
                    <nav class="${this.cssClasses.linkGroup}">
                        <ul class="${this.cssClasses.linkGroupItems}">
                            ${items.map(item => {
                                // Generate popover URL for items with children
                                let { url, target, preload } = item;
                                if (url === undefined && item.children) {
                                    const popoverUrl = new URL('/_navbar/menu', 'http://localhost');
                                    popoverUrl.searchParams.append('path', JSON.stringify([item.label]));
                                    url = popoverUrl.pathname + popoverUrl.search;
                                    target = '_overlay';
                                    preload = true;
                                }
                                target = target ?? '_top';

                                return this.renderHtml`
                                    <li>${this.renderView('_navbar/_link', { ...item, url, target, preload })}</li>
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
