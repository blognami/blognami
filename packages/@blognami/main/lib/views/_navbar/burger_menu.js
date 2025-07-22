
export const styles = `
    .root {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 0.5em 1em;
        max-width: 400px;
        width: 100%;
        margin: 1em auto;
        display: flex;
        flex-direction: column;
        gap: 1em;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal>
                <div class="${this.cssClasses.root}">
                    ${this.renderView('_navbar/_links')}
                </div>
            </pinstripe-modal>
        `;
    }
}