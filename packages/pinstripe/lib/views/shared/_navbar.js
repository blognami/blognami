
export const styles = `
    .root {
        border-width: 0 0 0.1rem 0;
        border-style: solid;
        border-color: var(--color-light-gray);
        padding-left: 1em;
        padding-right: 1em;
    }
    .inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        min-height: 3em;
    }
    .brand {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-weight: 600;
    }
    .menu {
        flex: 1 1 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .item {
        position: relative;
        padding: 0.375rem 1rem 0.375rem 0;
        white-space: nowrap;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
    }

    .item[data-active="true"] {
        background-color: #f9f9f9;
    }

    .item + .item {
        margin-left: 1em;
    }
`;

export default {
    render(){
        const { title, logoUrl, links = [], testId = 'navbar' } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}" data-test-id="${testId}">
                <div class="${this.cssClasses.inner}">
                    <div class="${this.cssClasses.brand}">
                        <a class="${this.cssClasses.item}" href="/" data-test-id="title">${title}</a>
                    </div>
                    <div class="${this.cssClasses.menu}">
                        ${links.map(({ body, href, target = '_top', preload, testId}) => {
                            return this.renderHtml`
                                <a class="${this.cssClasses.item}" href="${href}" target="${target}" ${preload ? 'data-preload' : ''} data-test-id="${testId}">${body}</a>
                            `;
                        })}
                    </div>
                </div>
            </div>
        `;
    }
};
