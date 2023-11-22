
export const styles = `
    .root {
        border-width: 0 0 0.1rem 0;
        border-style: solid;
        border-color: var(--color-light-gray);
        padding-left: 1em;
        padding-right: 1em;
    }
    .inner {
        margin: 0 auto;
        display: flex;
        min-height: 80px;
        max-width: 1200px;
    }
    .brand {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        color: #000;
        font-family: Inter;
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        padding: 7px 0 7px 0;
    }

    .brand img {
        margin-right: 13px;
    }

    .menu {
        flex: 1 1 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    
    .buttons {
        flex: 1 1 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .button {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #000;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        width: 139px;
        height: 38px;
        flex-shrink: 0;
        border-radius: 3px;
        background: #F5F5F5;
        margin-left: 20px;
        position: relative;
    }

    .button.is-selected::after, .button:hover::after {
        content: " ";
        display: block;
        width: 100%;
        height: 5px;
        flex-shrink: 0;
        border-radius: 2.5px;
        background: #70BE54;
        position: absolute;
        bottom: -12px;
    }
`;

export default {
    render(){
        const { title, logoUrl, links = [], testId = 'root' } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}" data-test-id="${testId}">
                <div class="${this.cssClasses.inner}">
                    <div class="${this.cssClasses.brand}">
                        <img src="${logoUrl}" />
                        <a href="/" data-test-id="title">${title}</a>
                    </div>
                    <div class="${this.cssClasses.buttons}">
                        ${links.map(({ body, href, target = '_top', preload, testId, selected }) => this.renderHtml`
                            <a class="${this.cssClasses.button} ${selected ? this.cssClasses.isSelected : ''}" href="${href}" target="${target}" ${preload ? 'data-preload' : ''} data-test-id="${testId}">${body}</a>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
};
