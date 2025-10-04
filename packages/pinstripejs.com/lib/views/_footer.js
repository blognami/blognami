export const styles = `
    .root {
        border-top: 1px solid #e5e7eb;
        background-color: #f9fafb;
        padding: 4.8rem 0;
        margin-top: 6.4rem;
    }

    .container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 2.4rem;
        text-align: center;
    }

    .text {
        color: #6b7280;
        font-size: 1.4rem;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <footer class="${this.cssClasses.root}">
                <div class="${this.cssClasses.container}">
                    <p class="${this.cssClasses.text}">
                        © 2025 Pinstripe JS. Open source JavaScript web framework.
                    </p>
                </div>
            </footer>
        `;
    }
};