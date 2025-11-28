
export const styles = ({ colors, breakpointFor }) => `
    .root {
        display: none;
    }

    ${breakpointFor('md')} {
        .root {
            display: flex;
            width: 25.6rem;
            padding: 3.2rem 0;
            border-right: 1px solid ${colors.gray[200]};
            position: sticky;
            top: 6.4rem;
            height: calc(100vh - 6.4rem);
            overflow-y: auto;
            padding-right: 2.4rem;
            flex-direction: column;
            gap: 3.2rem;
        }
    }
`;

export default {
    async render(){
        const sections = await this.menus.sidebar || [];

        if(sections.length === 0) return;

        return this.renderHtml`
            <aside class="${this.cssClasses.root}" data-test-id="sidebar">
                ${sections.map(section => {
                    const { partial, ...restOfSection } = section;
                    return this.renderView(partial, restOfSection);
                })}
            </aside>
        `;
    }
};