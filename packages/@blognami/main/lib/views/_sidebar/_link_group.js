export const styles = `
    .root {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        display: block;
        text-decoration: none;
        color: #6b7280;
        padding: 0.6rem 0;
        font-size: 1.4rem;
        transition: color 0.2s ease;
        border-left: 2px solid transparent;
        padding-left: 1.2rem;
        margin-left: -1.2rem;
    }

    .link:hover {
        color: #111827;
    }

    .link-active {
        color: #35D0AC;
        border-left-color: #35D0AC;
        background-color: rgba(53, 208, 172, 0.05);
    }
`;

export default {
    render(){
        const links = this.params.children;
        
        if (!links || links.length === 0) return;

        return this.renderHtml`
            <ul class="${this.cssClasses.root}">
                ${links.map(link => {
                    const { url, label } = link;
                    
                    return this.renderHtml`
                        <li>
                            ${() => {
                                if (url) {
                                    const isActive = this.initialParams._url.pathname === url;
                                    const activeClass = isActive ? this.renderHtml` ${this.cssClasses.linkActive}` : '';
                                    return this.renderHtml`<a href="${url}" class="${this.cssClasses.link}${activeClass}">${label}</a>`;
                                }
                                return this.renderHtml`<span class="${this.cssClasses.link}">${label}</span>`;
                            }}
                            ${link.children && link.children.length > 0 
                                ? this.renderView('_sidebar/_link_group', link)
                                : ''
                            }
                        </li>
                    `;
                })}
            </ul>
        `;
    }
};