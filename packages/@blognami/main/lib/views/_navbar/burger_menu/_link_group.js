export const styles = ({ colors }) => `
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
        background-color: ${colors.gray[50]};
    }

    .link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: ${colors.gray[700]};
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
        color: ${colors.gray[800]};
        background-color: ${colors.gray[50]};
    }

    .link:active {
        transform: scale(0.98);
    }

    /* Nested links styling */
    .root .root {
        margin-top: 0.8rem;
        margin-left: 1.6rem;
        padding-left: 1.6rem;
        border-left: 2px solid ${colors.gray[100]};
    }

    .root .root .link {
        font-size: 1.4rem;
        padding: 0.8rem 1.2rem;
        color: ${colors.gray[500]};
    }

    .root .root .link:hover {
        color: ${colors.gray[700]};
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