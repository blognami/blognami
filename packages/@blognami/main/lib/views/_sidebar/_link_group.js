export const styles = ({ colors, remify }) => `
    .root {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-decoration: none;
        color: ${colors.gray[500]};
        padding: ${remify(6)} 0;
        font-size: ${remify(14)};
        transition: color 0.2s ease;
        border-left: ${remify(2)} solid transparent;
        padding-left: ${remify(12)};
        margin-left: -${remify(12)};
    }

    .link:hover {
        color: ${colors.gray[900]};
    }

    .link-active {
        color: ${colors.semantic.accent};
        border-left-color: ${colors.semantic.accent};
        background-color: color-mix(in oklch, ${colors.semantic.accent} 5%, transparent);
    }

    .badge {
        padding: ${remify(4)} ${remify(8)};
        font-size: ${remify(13)};
        line-height: 1;
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(32)};
    }
`;

export default {
    render(){
        const links = this.params.children;
        
        if (!links || links.length === 0) return;

        return this.renderHtml`
            <ul class="${this.cssClasses.root}">
                ${links.map(link => {
                    const { url, label, badge } = link;
                    
                    return this.renderHtml`
                        <li>
                            ${() => {
                                if (url) {
                                    const isActive = this.initialParams._url.pathname === url;
                                    const activeClass = isActive ? this.renderHtml` ${this.cssClasses.linkActive}` : '';
                                    return this.renderHtml`<a href="${url}" class="${this.cssClasses.link}${activeClass}">
                                        <span>${label}</span>
                                        ${badge ? this.renderHtml`<span class="${this.cssClasses.badge}">${badge}</span>` : ''}
                                    </a>`;
                                }
                                return this.renderHtml`<span class="${this.cssClasses.link}">
                                    <span>${label}</span>
                                    ${badge ? this.renderHtml`<span class="${this.cssClasses.badge}">${badge}</span>` : ''}
                                </span>`;
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