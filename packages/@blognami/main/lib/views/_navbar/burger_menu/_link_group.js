export const styles = ({ colors, remify }) => `
    .root {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: ${remify(4)};
        width: 100%;
        overflow: hidden;
    }

    .item {
        border-radius: ${remify(8)};
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
        padding: ${remify(12)} ${remify(16)};
        font-size: ${remify(15.2)};
        font-weight: 500;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: ${remify(8)};
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
        margin-top: ${remify(8)};
        margin-left: ${remify(16)};
        padding-left: ${remify(16)};
        border-left: ${remify(2)} solid ${colors.gray[100]};
    }

    .root .root .link {
        font-size: ${remify(14)};
        padding: ${remify(8)} ${remify(12)};
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
                    const { url, target = '_top', label } = link;
                    
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