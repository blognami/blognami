
export const styles = `
    .root {
        background: #fff;
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
        border-radius: 6px;
        width: 100vw;
        max-width: 250px;
        padding: 6px 0;
    }
    
    .item {
        display: block;
        padding: 6px 12px;
        text-decoration: none;
        color: #000;
    }
    
    .item:hover {
        background: #f7f7f7;
    }
`;

export default {
    render(){
        const { items = [] } = this.params;
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${items.map(({ body, href, target = '_top', preload, testId, confirm }) => this.renderHtml`
                    <a class="${this.cssClasses.item}" href="${href}" target="${target}" ${preload ? 'data-preload' : ''} data-test-id="${testId}" data-confirm="${confirm}">${body}</a>
                `)}
            </div>
        `;
    }
};
