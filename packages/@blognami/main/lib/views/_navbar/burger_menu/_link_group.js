export const styles = `
    .root {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        width: 100%;
        overflow: hidden;
    }

    .item {
        border-radius: 8px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%;
        overflow: hidden;
    }

    .item:hover {
        background-color: #f8fafc;
    }

    .link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #374151;
        padding: 1.2rem 1.6rem;
        font-size: 1.52rem;
        font-weight: 500;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 8px;
        position: relative;
        line-height: 1.4;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .link:hover {
        color: #1f2937;
        background-color: #f8fafc;
    }

    .link:active {
        transform: scale(0.98);
    }

    /* Nested links styling */
    .root .root {
        margin-top: 0.8rem;
        margin-left: 1.6rem;
        padding-left: 1.6rem;
        border-left: 2px solid #f1f5f9;
    }

    .root .root .link {
        font-size: 1.4rem;
        padding: 0.8rem 1.2rem;
        color: #6b7280;
    }

    .root .root .link:hover {
        color: #374151;
    }
`;

export default {
    render(){
        const links = this.params.children;
        
        if (!links || links.length === 0) return;

        return this.renderHtml`
            <ul class="${this.cssClasses.root}">
                ${links.map(link => {
                    const { url, target, label } = link;
                    
                    return this.renderHtml`
                        <li class="${this.cssClasses.item}">
                            ${() => {
                                if (url) {
                                    return this.renderHtml`<a href="${url}" class="${this.cssClasses.link}" target="${target}">${label}</a>`;
                                }
                                return this.renderHtml`<span class="${this.cssClasses.link}">${label}</span>`;
                            }}
                            ${link.children && link.children.length > 0 
                                ? this.renderView('_navbar/burger_menu/_link_group', link)
                                : ''
                            }
                        </li>
                    `;
                })}
            </ul>
        `;
    }
};