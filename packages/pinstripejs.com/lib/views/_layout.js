
export const styles = `
    .root {
        background: yellow;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <h1>_layout.js view</h1>
            </div>
        `;
    }
};
