export const styles = `
    .root {
        background-color: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 40;
        backdrop-filter: blur(8px);
        background-color: rgba(255, 255, 255, 0.95);
    }

    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 2.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 6.4rem;
    }

    @media (max-width: 768px) {
        .container {
            padding: 0 1.6rem;
        }
    }
`;

export default {
    render(){
        return this.renderHtml`
            <header class="${this.cssClasses.root}" id="pinstripe-scroll-top">
                <div class="${this.cssClasses.container}">
                    ${this.renderView('_branding')}
                    ${this.renderView('_navbar')}
                </div>
            </header>
        `;
    }
};