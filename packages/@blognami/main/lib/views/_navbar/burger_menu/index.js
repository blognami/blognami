
export const styles = ({ breakpointFor }) => `
    .root {
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
        padding: 2.4rem;
        width: 100%;
        max-width: none;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 3.2rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: slideInUp 0.3s ease-out;
        box-sizing: border-box;
        overflow: hidden;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    ${breakpointFor('md')} {
        .root {
            padding: 3.2rem;
            border-radius: 16px;
            margin: 1.6rem auto;
            max-width: 420px;
        }
    }
`;

export default {
    async render(){
        const sections = await this.menus.burgerMenu || [];

        return this.renderHtml`
            <pinstripe-modal>
                <div class="${this.cssClasses.root}">
                    ${sections.map(section => {
                        const { partial, ...restOfSection } = section;
                        return this.renderView(partial, restOfSection);
                    })}
                </div>
            </pinstripe-modal>
        `;
    }
}