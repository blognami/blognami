
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
    }
    .item.has-dropdown {
        padding-right: 2.5em;
    }
    .item.has-dropdown::after {
        border: 3px solid transparent;
        border-radius: 2px;
        border-right: 0;
        border-top: 0;
        content: ' ';
        display: block;
        height: 0.625em;
        margin-top: -0.375em;
        pointer-events: none;
        position: absolute;
        top: 50%;
        transform: rotate(-45deg);
        transform-origin: center;
        width: 0.625em;
        border-color: #485fc7;
        right: 1.125em;
    }
    *:not(.dropdown) > .item + .item {
        margin-left: 1em;
    }
    .dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #fff;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border-top: 2px solid #dbdbdb;
        box-shadow: 0 8px 8px rgb(10 10 10 / 10%);
        padding: 8px 0 8px 0;
    }
    .dropdown .item {
        display: block;
        padding: 6px 48px 6px 16px;
    }
    .item:hover .dropdown, .item:focus .dropdown, .item:focus-within .dropdown {
        display: block;
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
                        ${links.map(({ body, href, target = '_top', preload, testId, dropdown}) => {
                            if(Array.isArray(dropdown)) return this.renderHtml`
                                <div class="${this.cssClasses.item} ${this.cssClasses.hasDropdown}" data-test-id="${testId}">
                                    ${body}
                                    <div class="${this.cssClasses.dropdown}">
                                        ${dropdown.map(({ body, href, target = '_top', preload, testId }) => this.renderHtml`
                                            <a class="${this.cssClasses.item}" href="${href}" target="${target}" ${preload ? 'data-preload' : ''} data-test-id="${testId}">${body}</a>
                                        `)}
                                    </div>
                                </div>
                            `;
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
