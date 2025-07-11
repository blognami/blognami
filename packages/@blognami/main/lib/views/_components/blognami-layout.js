

export const styles = `
    .root {
        font-weight: bold;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <div class=${this.cssClasses.root}>Hello World!</div>
            <slot></slot>
        `;
    }
}