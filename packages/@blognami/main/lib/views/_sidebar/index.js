
export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        display: none;
    }

    ${breakpointFor('md')} {
        .root {
            display: flex;
            width: ${remify(256)};
            padding: ${remify(32)} 0;
            border-right: ${remify(1)} solid ${colors.gray[200]};
            position: sticky;
            top: ${remify(64)};
            height: calc(100vh - ${remify(64)});
            overflow-y: auto;
            padding-right: ${remify(24)};
            flex-direction: column;
            gap: ${remify(32)};
        }
    }
`;

export default {
    async render(){
        const sections = await this.menus.content || [];

        return this.renderHtml`
            <aside class="${this.cssClasses.root}" data-test-id="sidebar">
                ${this.renderView('_sidebar/_top_section')}
                ${sections.map(section =>
                    this.renderView('_sidebar/_link_group_section', section)
                )}
            </aside>
        `;
    }
};
