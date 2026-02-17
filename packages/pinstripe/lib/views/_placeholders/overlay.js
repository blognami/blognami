
export const styles = ({ remify }) => `
    .root {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 50vh;
    }

    .spinner {
        width: ${remify(64)};
        height: ${remify(64)};
        border: ${remify(8)} solid #f3f3f3;
        border-top: ${remify(8)} solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .text {
        margin-top: ${remify(16)};
        font-size: ${remify(16)};
        color: #363636;
        text-align: center;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

export default {
    render(){
        return this.renderView('_pinstripe/_content', {
            body: this.renderHtml`
                <pinstripe-modal>
                    <div class="${this.cssClasses.root}">
                        <div class="${this.cssClasses.container}">
                            <div class="${this.cssClasses.spinner}"></div>
                            <div class="${this.cssClasses.text}">Loading...</div>
                        </div>
                    </div>
                </pinstripe-modal>
            `
        });
    }
}
