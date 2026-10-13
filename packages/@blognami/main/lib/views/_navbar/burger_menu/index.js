
export const styles = ({ colors, shadow, breakpointFor, remify }) => `
    .root {
        background-color: ${colors.white};
        border-radius: ${remify(12)};
        box-shadow: ${shadow.xl};
        padding: ${remify(24)};
        width: 100%;
        max-width: none;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: ${remify(32)};
        backdrop-filter: blur(${remify(10)});
        border: ${remify(1)} solid color-mix(in oklch, ${colors.white} 20%, transparent);
        animation: slideInUp 0.3s ease-out;
        box-sizing: border-box;
        overflow: hidden;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(${remify(20)});
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    ${breakpointFor('md')} {
        .root {
            padding: ${remify(32)};
            border-radius: ${remify(16)};
            margin: ${remify(16)} auto;
            max-width: ${remify(420)};
        }
    }
`;

export default {
    async render(){
        const { section } = this.params;
        const sectionItems = await this.menus.sections || [];
        const sectionMenuItems = section ? await this.menus[section] || [] : [];
        const userItems = await this.menus.user || [];

        return this.renderHtml`
            <blognami-modal height="full">
                <div class="${this.cssClasses.root}">
                    ${sectionItems.map(item =>
                        this.renderView('_navbar/burger_menu/_link_group_section', item)
                    )}
                    ${section === 'blog' ? this.renderView('_navbar/burger_menu/_top_section') : ''}
                    ${sectionMenuItems.map(item =>
                        this.renderView('_navbar/burger_menu/_link_group_section', item)
                    )}
                    ${userItems.map(item =>
                        this.renderView('_navbar/burger_menu/_link_group_section', item)
                    )}
                </div>
            </blognami-modal>
        `;
    }
}
